package br.com.bluebank.application.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import br.com.bluebank.application.service.exception.BlueBankException;
import br.com.bluebank.application.service.exception.DepositException;
import br.com.bluebank.application.service.exception.InvalidCoinException;
import br.com.bluebank.application.service.exception.NoAccountFoundException;
import br.com.bluebank.application.service.exception.NoFileFoundException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Coin.Coin;
import br.com.bluebank.domain.Coin.CoinRepository;
import br.com.bluebank.domain.Movement.DepositForm;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.utils.CashType;
import br.com.bluebank.utils.MovementServiceUtils;
import br.com.bluebank.domain.Movement.MovementRepository;

@Service
public class DepositService 
{
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private CoinRepository coinRepository;

    @Transactional
    public void save(DepositForm dForm) throws BlueBankException
    {   
        Account account = accountRepository.findById(dForm.getNumAccount()).orElseThrow(NoAccountFoundException::new);

        Map<String, String> errors = checkAndValidateDepositData(dForm, account);
        
        if(errors.size() > 0)
        {
            String msg = "Os dados para deposito não conferem com a conta "+account.getNumAccount();
            throw new DepositException(errors, msg);
        }

        if(dForm.getCashType() == CashType.BLUECOIN)
        {
            if(dForm.bluecoinFileIsEmpty())
            {
                throw new NoFileFoundException();
            }

            dForm = extractAmountFromFile(dForm);
        }

        Movement mvd = new Movement();
        mvd.setAccount(account);
        mvd.setDate(LocalDateTime.now());
        mvd.setTempAmount(dForm.getAmount());
        mvd.setMovementType(MovementType.DEPOSIT);
        mvd = MovementServiceUtils.prepareToSave(mvd, movementRepository);
        movementRepository.save(mvd);
    }

    private Map<String, String> checkAndValidateDepositData(DepositForm dForm, Account toAccount)
    {
        Map<String, String> errors = new LinkedHashMap<>();

        if(toAccount.getAccountType() != dForm.getAccountType())
        {
            errors.put("accountType", "O tipo da conta informada não é do mesmo tipo do número de conta");
        }

        return errors;
    }
    
    private DepositForm extractAmountFromFile(DepositForm dForm) throws DepositException
    {
        try 
        {
            MultipartFile file = dForm.getBluecoinFile();
            String fileName = file.getOriginalFilename();

            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
            bodyBuilder.part("file", file.getInputStream().readAllBytes()).header("Content-Disposition", "form-data; name=file; filename="+fileName);

            WebClient webClient = WebClient.create("http://api.qrserver.com/v1/read-qr-code/");
            
            String response = webClient.post()
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                .retrieve()
                .bodyToMono(String.class)
            .block();


            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            
            String dataEncoded = root.get(0).get("symbol").get(0).get("data").asText();
            Coin coin = checkResponseDataQrCodeServer(dataEncoded);
            dForm.setAmount(coin.getValue());

            coin = coinRepository.findById(coin.getId()).orElseThrow(InvalidCoinException::new);
            coinRepository.delete(coin);

            return dForm;
        } 
        catch (IOException e) 
        {
            throw new RuntimeException(e);
        }
    }

    private Coin checkResponseDataQrCodeServer(String dataEncoded) throws DepositException
    {
        if(dataEncoded == null)
        {
            throw new DepositException("Arquivo sem dados de retorno");
        }

        String dataDecoded = new String(Base64.getDecoder().decode(dataEncoded));

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        try
        {
            return mapper.readValue(dataDecoded, Coin.class);
        }
        catch(IOException ex)
        {
            String msg = "O arquivo anexado não é um BlueCoin";

            Map<String, String> error = new LinkedHashMap<>();
            error.put("bluecoinFile", msg);
            
            throw new DepositException(error, msg);
        }
    }
}
