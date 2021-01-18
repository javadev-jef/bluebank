package br.com.bluebank.application.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.MovementRepository;
import br.com.bluebank.domain.Movement.StatementFilter;
import br.com.bluebank.domain.Movement.StatementResponse;
import br.com.bluebank.utils.MovementServiceUtils;

@Service
public class MovementService 
{
    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private AccountRepository accountRepository;

    public BigDecimal getUserBalance(String numAccount) 
    {
        return movementRepository.findBalanceByNumAccount(numAccount);
    }

    public StatementResponse getStatementData(StatementFilter stf) 
    {
        Account accountUser = accountRepository.findByUser_idAndAccountType(1, stf.getAccountType()).orElseThrow();
        List<Movement> mvts = movementRepository.findAllByStatementFilter(accountUser.getAccountType(), accountUser.getUser(), stf.getInitialDate(), stf.getFinalDate());

        BigDecimal t = mvts.stream().map(x -> x.getFinalAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        return StatementResponse.fromData(mvts, t);
    }

    public Movement save(Movement mv) throws InsufficienteBalanceException
    {
        if(mv.getNumTransaction() == null)
        {
            Long lastNumTransaction = movementRepository.findLastNumTransaction();
            mv.setNumTransaction(lastNumTransaction);
        }
        
        mv = MovementServiceUtils.prepareToSave(mv, movementRepository);
        mv = movementRepository.save(mv);

        return mv;
    }
}