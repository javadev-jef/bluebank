package br.com.bluebank.domain.User;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.utils.StringUtils;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "TBL_USER")
@SuppressWarnings("serial")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User implements Serializable
{
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Integer id;

    @Size(min = 4, message = "O nome informando é muito pequeno")
    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 4) @Enumerated(EnumType.STRING)
    @NotNull(message = "Nenhuma opção foi selecionada")
    private PersonType personType;

    @Column(nullable = false, unique = true, length = 14)
    @Pattern(regexp = "[0-9]{11}|[0-9]{14}", message = "CPF/CNPJ informado é inválido")
    private String cpfCnpj;

    @Column(nullable = false)
    @NotNull(message = "O campo não pode ser vázio")
    private LocalDate birthDate;

    @Email(message = "O email informado é inválido")
    @NotBlank(message = "Nenhum email foi informado")
    @Column(nullable = false, unique = true, length = 64)
    private String email;

    @NotNull(message = "Nenhum estado foi selecionado")
    @Column(nullable = false)
    private Integer stateId;

    @Column(nullable = false)
    @NotNull(message = "Nenhuma cidade foi selecionada")
    private Integer cityId;

    @Column(nullable = false, length = 80)
    @Size(min = 6, message = "A senha informada é muito pequena")
    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Account> accounts = new ArrayList<>();

    @Getter
    public enum PersonType
    {
        CNPJ("Pessoa Jurídica"),
        CPF("Pessoa Física");

        public String displayName;

        PersonType(String displayName)
        {
            this.displayName = displayName;
        }
    }

    @JsonIgnore
    public boolean isNotEmptyPassword()
    {
        return StringUtils.isEmpty(this.password);
    }

    @JsonIgnore
    public void encryptPassword()
    {
        this.password = StringUtils.encrypt(this.password);
    }
}