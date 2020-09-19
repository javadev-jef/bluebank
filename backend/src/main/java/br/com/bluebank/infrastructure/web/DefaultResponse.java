package br.com.bluebank.infrastructure.web;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Movement.WithdrawForm.WithdrawType;
import br.com.bluebank.domain.User.User.PersonType;
import lombok.Getter;

@Getter
public class DefaultResponse 
{
    private List<Account> userAccountTypes;
    private List<Map<String, String>> accountTypes = new ArrayList<>();
    private List<Map<String, String>> personTypes = new ArrayList<>();
    private List<Map<String, String>> withdrawTypes = new ArrayList<>();

    private DefaultResponse(){}

    /**
     * User must be logged
     */
    public static DefaultResponse fromData(List<Account> userAccountTypes, AccountType[] accountTypes, PersonType[] personTypes, WithdrawType[] withdrawTypes)
    {
        DefaultResponse resp = new DefaultResponse();
        resp.userAccountTypes = userAccountTypes;
        
        Map<String, String> account;
        for(int i=0; i<accountTypes.length; i++)
        {
            account = new LinkedHashMap<>();
            account.put("type", accountTypes[i].name());
            account.put("displayName", accountTypes[i].getDisplayName());

            resp.accountTypes.add(i, account);
        }

        Map<String, String> persons;
        for(int i=0; i<personTypes.length; i++)
        {
            persons = new LinkedHashMap<>();
            persons.put("type", personTypes[i].name());
            persons.put("displayName", personTypes[i].getDisplayName());

            resp.personTypes.add(i, persons);
        }

        Map<String, String> wdTypes;
        for(int i=0; i<withdrawTypes.length; i++)
        {
            wdTypes = new LinkedHashMap<>();
            wdTypes.put("type", withdrawTypes[i].name());
            wdTypes.put("displayName", withdrawTypes[i].getDisplayName());

            resp.withdrawTypes.add(i, wdTypes);
        }

        return resp;
    }
}
