package br.com.bluebank.application.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Coin.Coin;
import br.com.bluebank.domain.Coin.CoinRepository;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.utils.CashType;
import br.com.bluebank.utils.MovementServiceUtils;
import br.com.bluebank.domain.Movement.MovementRepository;
import br.com.bluebank.domain.Movement.WithdrawForm;

@Service
public class WithdrawService 
{
    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private CoinRepository coinRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public Optional<byte[]> save(WithdrawForm wform, Integer userId) throws InsufficienteBalanceException
    {
        Account userAccount = accountRepository.findByUser_idAndAccountType(userId, wform.getAccountType()).orElseThrow();

        Movement mvw = new Movement();
        mvw.setAccount(userAccount);
        mvw.setDate(LocalDateTime.now());
        mvw.setMovementType(MovementType.WITHDRAW);
        mvw.setTempAmount(wform.getAmount());

        mvw = MovementServiceUtils.prepareToSave(mvw, movementRepository);

        if(wform.getCashType() == CashType.CASH)
        {
            movementRepository.save(mvw);
            return Optional.empty();
        }

        try
        {
            Coin coin = new Coin(mvw);
            coinRepository.save(coin);
            
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            
            String coinJson = mapper.writeValueAsString(coin);
            String coinJsonEncoded = Base64.getEncoder().encodeToString(coinJson.getBytes());
            
            WebClient webClient = WebClient.create("https://api.qrserver.com/v1/create-qr-code");
            byte[] response = webClient.get()
                .uri("/?size=150x150&color=0087D0&bgcolor=fff&data="+coinJsonEncoded)
                .accept(MediaType.IMAGE_PNG)
                .retrieve()
                .bodyToMono(byte[].class)
            .block();
            
            movementRepository.save(mvw);

            return Optional.of(response);
        }
        catch(JsonProcessingException ex)
        {
            throw new RuntimeException(ex);
        }
    }
}
