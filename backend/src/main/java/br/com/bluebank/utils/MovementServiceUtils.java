package br.com.bluebank.utils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;

public class MovementServiceUtils
{
    public static Movement prepareToSave(Movement mv) throws InsufficienteBalanceException
    {
        Account account = mv.getAccount();

        BigDecimal balanceDB = account.getBalance();
        BigDecimal currentBalance = balanceDB != null ? balanceDB : BigDecimal.ZERO;

        mv.setFinalAmount(mv.getTempAmount());
        mv.setBalance(currentBalance);
        mv.setDescription(mv.getDescription() == null ? getDefaultDescription(mv.getMovementType()) : mv.getDescription());
        
        if(!mv.getScheduled())
        {
            account.setBalance(mv.getBalance());
        }

        return mv;
    }   

    private static String getDefaultDescription(MovementType movementType)
    {
        Map<MovementType, String> descriptions = new HashMap<>();
        descriptions.put(MovementType.DEPOSIT, "Depósito realizado via terminal virtual");
        descriptions.put(MovementType.BONUS, "Bonificação por abertura de conta BlueBank");
        descriptions.put(MovementType.WITHDRAW, "Saque realizado via terminal virtual");

        return descriptions.get(movementType);
    }

    /**
     * Should only be called when creating the account
     * @param account
     * @return Movement
     */
    public static Movement generateInitialMovement(Account account)
    {
        Movement mv = new Movement();
        mv.setDate(LocalDateTime.now());
        mv.setMovementType(MovementType.BONUS);
        mv.setTempAmount(BigDecimal.valueOf(100));
        mv.setAccount(account);

        return mv;
    }
}
