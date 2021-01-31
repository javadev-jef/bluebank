package br.com.bluebank.application.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Blacklist.Blacklist;
import br.com.bluebank.domain.Blacklist.BlacklistRepository;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.Movement.MovementRepository;

@Component
@EnableScheduling
public class ScheduledTasks 
{
    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MovementService movementService;

    @Autowired
    private BlacklistRepository blacklistRepository;

    private final String CLASS_NAME = this.getClass().getSimpleName();

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(cron = "0 00 00 * * *")
    public void checkAndPersistSchedules() throws InsufficienteBalanceException
    {
        logger.debug(CLASS_NAME.concat("....RUNNING"));

        scheduledTokenBlacklist();
        scheduledDeposits();
        scheduledTransfers();

        logger.debug(CLASS_NAME.concat("....FINISHED"));
    }

    public void scheduledTokenBlacklist()
    {
        List<Blacklist> blockedTokens = blacklistRepository.deleteByExpLessThanEqual(LocalDateTime.now());
        logger.debug(CLASS_NAME.concat("......DELETED BLOCKED TOKENS: "+blockedTokens.size()));
    }

    @Transactional(rollbackFor = Exception.class)
    private void scheduledDeposits() throws InsufficienteBalanceException
    {
        List<Movement> deposits = movementRepository.findScheduledByDateAndType(LocalDate.now(), MovementType.DEPOSIT);

        for(Movement deposit : deposits)
        {
            Account account = deposit.getAccount();
            BigDecimal balance = account.getBalance();

            deposit.setScheduled(false);
            deposit.setDate(LocalDateTime.now());
            deposit.setBalance(balance);
            account.setBalance(deposit.getBalance());
            
            movementRepository.save(deposit);

            if(!deposit.getScheduled())
            {
                accountRepository.save(deposit.getAccount());
            }
        }
    }

    /**
     * Should be called after scheduledDeposits()
     */
    @Transactional(rollbackFor = Exception.class)
    private void scheduledTransfers() throws InsufficienteBalanceException
    {
        List<Movement> transfers = movementRepository.findAllScheduledByDate(LocalDate.now());

        for(int i=0; i<transfers.size(); i++)
        {
            Movement transferTarget = prepareMovement(transfers, MovementType.TRANSFER_TARGET, null);
            Movement transferSource = prepareMovement(transfers, transferTarget);

            try
            {
                movementService.save(transferSource);
                movementService.save(transferTarget);
            }
            catch(InsufficienteBalanceException ex)
            {
                Account account = transferSource.getAccount();
                BigDecimal balance = account.getBalance();

                transferSource.setFinalAmount(BigDecimal.ZERO);
                transferSource.setBalance(balance);
                account.setBalance(transferSource.getBalance());

                movementRepository.save(transferSource);
                movementRepository.delete(transferTarget);
                
                if(!transferSource.getScheduled())
                {
                    accountRepository.save(account);
                }
            }

            i = transfers.removeAll(List.of(transferTarget, transferSource)) ? 0 : i;
        }

        // Delete failed movement scheduled
        transfers = movementRepository.findAllFailedMovementScheduledByDate(LocalDate.now());
        transfers.stream().forEach(transfer -> movementRepository.delete(transfer));
    }

    private Movement prepareMovement(List<Movement> mvts, MovementType mvType, Long numTransaction)
    {
        return mvts.stream()
            .map(mv -> 
            {
                mv.setScheduled(false); 
                mv.setDate(LocalDateTime.now());
                mv.setTempAmount(mv.getFinalAmount().multiply(mv.getMovementType().getFactor()));
                
                return mv;
            })
            .filter(mv -> mv.getMovementType() == mvType && mv.getNumTransaction().equals(numTransaction == null ? mv.getNumTransaction() : numTransaction))
            .collect(Collectors.toList())
        .get(0);
    }

    private Movement prepareMovement(List<Movement> mvts, Movement mvTarget)
    {
        Movement mv = prepareMovement(mvts, MovementType.TRANSFER_SOURCE, mvTarget.getNumTransaction());
        
        Account account = mv.getAccount();
        BigDecimal balance = account.getBalance();

        if(balance.compareTo(mv.getTempAmount()) == -1)
        {
            Account fromAccount = mv.getAccount();
            Account toAccount = mvTarget.getAccount();

            String msg = "Falha da tentativa de transferência agendada para ";

            if (fromAccount.getUser().getId() == toAccount.getUser().getId()) 
            {
                mv.setDescription(msg + toAccount.getAccountTypeDisplayName());
            }
            else
            {
                mv.setDescription(msg + toAccount.getUser().getName());
            }
        }

        return mv;
    }
}