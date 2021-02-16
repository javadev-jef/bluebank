package br.com.bluebank.domain.coin;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.bluebank.domain.Coin.Coin;
import br.com.bluebank.domain.Coin.CoinRepository;

@DataJpaTest
@ActiveProfiles(value = "test")
public class CoinRepositoryTest 
{
    @Autowired
    private CoinRepository coinRepository;
    
    @Test
    public void saveAndDelete()
    {
        Coin coin = new Coin();
        coin.setFabrication(LocalDateTime.now());
        coin.setValue(BigDecimal.valueOf(12).setScale(2));

        Coin coinPersisted = coinRepository.saveAndFlush(coin);

        assertNotNull(coin.getId());
        assertEquals(coin.getValue(), coinPersisted.getValue());

        coin = coinRepository.findById(coinPersisted.getId()).orElse(null);

        assertNotNull(coin);
        coinRepository.delete(coin);

        assertNotNull(coin.getId());
        coin = coinRepository.findById(coin.getId()).orElse(null);
        assertNull(coin);
    }
}