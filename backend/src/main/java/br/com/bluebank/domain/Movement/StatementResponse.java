package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;

@Getter
@SuppressWarnings("serial")
public class StatementResponse implements Serializable
{
    private List<Movement> movements;
    private BigDecimal balance;

    private StatementResponse(){}
    
    public static StatementResponse fromData(List<Movement> mvts, BigDecimal balance)
    {
        StatementResponse str = new StatementResponse();
        str.movements = mvts;
        str.balance = balance;

        return str;
    }
}
