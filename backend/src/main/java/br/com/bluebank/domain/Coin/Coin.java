package br.com.bluebank.domain.Coin;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import br.com.bluebank.domain.Movement.Movement;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "TBL_COIN")
@SuppressWarnings("serial")
public class Coin implements Serializable
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "A data de fabricação da moeda não foi informada")
    private LocalDateTime fabrication;

    @Column(nullable = false)
    @NotNull(message = "O valor da moeda não foi informado")
    private BigDecimal value;

    public Coin(){}
    
    public Coin(Movement movement) 
    {
        this.fabrication = LocalDateTime.now();
        this.value = movement.getTempAmount();
    }
}
