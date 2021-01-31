package br.com.bluebank.domain.Blacklist;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "TBL_TOKEN_BLACKLIST")
public class Blacklist 
{
    @Id
    @Column(unique = true, nullable = false)
    private String tokenId;

    @Column(nullable = false, length = 14)
    @Pattern(regexp = "[0-9]{11}|[0-9]{14}", message = "Username informado é inválido")
    private String username;

    @Column(nullable = false)
    @NotNull(message = "Data de expiração não pode ser null")
    private LocalDateTime exp;

    @Column(nullable = false)
    @NotNull(message = "Data de emissão não pode ser null")
    private LocalDateTime iat;

    @Column(nullable = false)
    @NotNull(message = "Data de bloqueio não pode ser null")
    private LocalDateTime blockDate;

    public void setExp(Date date)
    {
        this.exp = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }

    public void setIat(Date date)
    {
        this.iat = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }
}
