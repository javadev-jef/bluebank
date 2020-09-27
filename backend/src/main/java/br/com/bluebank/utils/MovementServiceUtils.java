package br.com.bluebank.utils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.Movement.MovementRepository;

public class MovementServiceUtils
{
    public static Movement prepareToSave(Movement mv, MovementRepository mvr) throws InsufficienteBalanceException
    {
        String numAccount = mv.getAccount().getNumAccount();

        BigDecimal balanceDB = mvr.findBalanceByNumAccount(numAccount);
        BigDecimal currentBalance = balanceDB != null ? balanceDB : BigDecimal.ZERO;

        mv.setFinalAmount(mv.getTempAmount());
        mv.setBalance(currentBalance);
        mv.setDescription(mv.getDescription() == null ? getDefaultDescription(mv.getMovementType()) : mv.getDescription());

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
}
