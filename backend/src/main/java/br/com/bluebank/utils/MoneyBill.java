package br.com.bluebank.utils;

import lombok.Getter;

@Getter
public enum MoneyBill 
{
    TWO_REAL(2),
    FIVE_REAL(5),
    TEN_REAL(10),
    TWENTY_REAL(20),
    FIFITY_REAL(50),
    ONE_HUNDRED_REAL(100),
    TWO_HUNDRED_REAL(200);

    private Integer value;

    MoneyBill(Integer value)
    {
        this.value = value;
    }

	@Override
    public String toString() 
    {
		return this.value.toString();
	}
}
