package br.com.bluebank.utils;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.com.bluebank.application.service.exception.TransactionException;

public class TransactionUtils 
{
    /**
     * Only for Deposits and Withdrawals
     * 
     * @throws TransactionException
     */
    public static void validateAmountByCashType(BigDecimal amount, CashType cashType) throws TransactionException
    {
        List<MoneyBill> moneyBill = Arrays.asList(MoneyBill.values());
        for(int i=0; i<moneyBill.size(); i++)
        {
            MoneyBill mbCurrent = moneyBill.get(i);
            if(isAmountNotValidForType(amount, mbCurrent.getValue(), cashType))
            {
                String msg = "Somente é permitido a esta operação valores multiplos a "+Arrays.toString(MoneyBill.values());

                Map<String, String> error = new LinkedHashMap<>();
                error.put("amount", msg);

                if(i == moneyBill.size() -1)
                {
                    throw new TransactionException(error, msg);
                }
            }
            else
            {
                break;
            }
        }
    }

    private static boolean isAmountNotValidForType(BigDecimal amount, Integer multiple, CashType cashType) throws TransactionException
    {
        if(amount == null && cashType == CashType.CASH)
        {
            throw new TransactionException("Nenhum valor informado para operação desejada.");
        }

        return cashType == CashType.CASH && amount.doubleValue() % multiple != 0;
    }
}