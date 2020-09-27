package br.com.bluebank.utils;

import lombok.Getter;

@Getter
public enum CashType 
{
    CASH("Dinheiro"),
    BLUECOIN("BlueCoin");

    public String displayName;

    CashType(String displayName)
    {
        this.displayName = displayName;
    }
}
