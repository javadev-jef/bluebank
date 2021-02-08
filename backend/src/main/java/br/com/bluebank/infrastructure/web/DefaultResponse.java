package br.com.bluebank.infrastructure.web;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.domain.User.UserLogon.LogonType;
import br.com.bluebank.utils.CashType;
import lombok.Getter;

@Getter
public class DefaultResponse 
{
    private Map<String, String> userAccounts = new LinkedHashMap<>();
    private List<Map<String, String>> accountTypes = new ArrayList<>();
    private List<Map<String, String>> personTypes = new ArrayList<>();
    private List<Map<String, String>> cashTypes = new ArrayList<>();
    private List<Map<String, String>> logonTypes = new ArrayList<>();

    private DefaultResponse(){}

    /**
     * Return a DefaultResponse with:
     * User account list (only logged) AccountTypes, PersonTypes, CashTypes, and LogonTypes
     */
    public static DefaultResponse fromData(List<Account> userAccounts)
    {
        DefaultResponse resp = new DefaultResponse();

        if(userAccounts != null)
        {
            for(int i=0; i<userAccounts.size(); i++)
            {
                Account account = userAccounts.get(i);

                resp.userAccounts.put(account.getAccountType().name(), account.getNumAccount());
            }
        }

        Map<String, String> account;
        AccountType[] accountTypes = Account.AccountType.values();
        
        for(int i=0; i<accountTypes.length; i++)
        {
            account = new LinkedHashMap<>();
            account.put("type", accountTypes[i].name());
            account.put("displayName", accountTypes[i].getDisplayName());

            resp.accountTypes.add(i, account);
        }

        Map<String, String> persons;
        PersonType[] personTypes = PersonType.values();

        for(int i=0; i<personTypes.length; i++)
        {
            persons = new LinkedHashMap<>();
            persons.put("type", personTypes[i].name());
            persons.put("displayName", personTypes[i].getDisplayName());

            resp.personTypes.add(i, persons);
        }

        Map<String, String> cTypes;
        CashType[] cashTypes = CashType.values();
        
        for(int i=0; i<cashTypes.length; i++)
        {
            cTypes = new LinkedHashMap<>();
            cTypes.put("type", cashTypes[i].name());
            cTypes.put("displayName", cashTypes[i].getDisplayName());

            resp.cashTypes.add(i, cTypes);
        }

        Map<String, String> lTypes;
        LogonType[] logonTypes = LogonType.values();
        
        for(int i=0; i<logonTypes.length; i++)
        {
            lTypes = new LinkedHashMap<>();
            lTypes.put("type", logonTypes[i].name());
            lTypes.put("displayName", logonTypes[i].getDisplayName());

            resp.logonTypes.add(i, lTypes);
        }

        return resp;
    }
}
