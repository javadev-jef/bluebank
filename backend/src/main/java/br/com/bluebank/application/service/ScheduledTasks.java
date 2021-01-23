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
    private MovementService movementService;

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(cron = "0 00 00 * * *")
    public void checkAndPersistSchedules() throws InsufficienteBalanceException
    {
        logger.info("ScheduledTasks....RUNNING");

        scheduledDeposits();
        scheduledTransfers();

        logger.info("ScheduledTasks....FINISHED");
    }

    @Transactional(rollbackFor = Exception.class)
    private void scheduledDeposits() throws InsufficienteBalanceException
    {
        List<Movement> deposits = movementRepository.findScheduledByDateAndType(LocalDate.now(), MovementType.DEPOSIT);

        for(Movement deposit : deposits)
        {
            BigDecimal balance = movementRepository.findBalanceByNumAccount(deposit.getAccount().getNumAccount());

            deposit.setScheduled(false);
            deposit.setDate(LocalDateTime.now());
            deposit.setBalance(balance);
            movementRepository.save(deposit);
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
                BigDecimal balance = movementRepository.findBalanceByNumAccount(transferSource.getAccount().getNumAccount());
                transferSource.setFinalAmount(BigDecimal.ZERO);
                transferSource.setBalance(balance);

                movementRepository.save(transferSource);
                movementRepository.delete(transferTarget);
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
        
        BigDecimal balance = movementRepository.findBalanceByNumAccount(mv.getAccount().getNumAccount());

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