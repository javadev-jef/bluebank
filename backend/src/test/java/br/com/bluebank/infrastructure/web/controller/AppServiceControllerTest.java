package br.com.bluebank.infrastructure.web.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Movement.DepositForm;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.MovementRepository;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.domain.User.UserRepository;
import br.com.bluebank.infrastructure.web.DefaultResponse;
import br.com.bluebank.utils.CashType;
import br.com.bluebank.utils.ObjectMapperUtils;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(value = "test")
public class AppServiceControllerTest 
{
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovementRepository movementRepository;

    @Test
    public void getAccountBalance_withoutToken() throws Exception
    {
        MvcResult result = mockMvc.perform(
            post("/api/user/account/SAVINGS_ACCOUNT/balance")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
            .andDo(print())
            .andReturn();

        assertEquals(401, result.getResponse().getStatus());
    }

    @Test
    public void registerUser() throws Exception
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3131307);
        user.setCpfCnpj("44570645054");
        user.setEmail("usuario@email.com.br");
        user.setName("Jose Carlos Augusto");
        user.setPassword("654321");
        user.setPersonType(PersonType.CPF);
        user.setStateId(31);

        String userJsonStr = ObjectMapperUtils.ObjectToJson(user);
        
        mockMvc.perform(post("/api/user/register")
            .content(userJsonStr).contentType(MediaType.APPLICATION_JSON_VALUE))
        .andDo(print())
        .andExpect(status().isCreated())
        .andReturn();

        User userBD = userRepository.findByCpfCnpj(user.getCpfCnpj()).orElseThrow();
        assertNotNull(userBD);
        assertNotNull(userBD.getId());
        assertEquals(user.getName(), userBD.getName());

        assertThat(userBD.getAccounts()).hasSize(2);
    }

    @Test
    public void deposit() throws Exception
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(754);
        user.setCpfCnpj("61321346034");
        user.setEmail("usuario02@email.com.br");
        user.setName("Thaisy Fernandes");
        user.setPassword("74198465");
        user.setPersonType(PersonType.CPF);
        user.setStateId(16);

        String userJsonStr = ObjectMapperUtils.ObjectToJson(user);
        
        mockMvc.perform(post("/api/user/register")
            .content(userJsonStr).contentType(MediaType.APPLICATION_JSON_VALUE))
        .andDo(print())
        .andExpect(status().isCreated())
        .andReturn();

        User userBD = userRepository.findByCpfCnpj(user.getCpfCnpj()).orElseThrow();
        assertNotNull(userBD);

        DepositForm dForm = new DepositForm();
        dForm.setAccountType(AccountType.SAVINGS_ACCOUNT);
        dForm.setAmount(BigDecimal.valueOf(12).setScale(2));
        dForm.setCashType(CashType.CASH);
        dForm.setCpfCnpj(userBD.getCpfCnpj());
        dForm.setDepositorName("Augusto Pietro");
        dForm.setFavoredName(userBD.getName());
        dForm.setNumAccount(userBD.getAccounts().get(0).getNumAccount());
        dForm.setPhone("31999999999");

        MultiValueMap<String, String> params = ObjectMapperUtils.objectToMultiValueMap(dForm);
        
        MvcResult result = mockMvc.perform(post("/api/user/account/deposit")
            .params(params)
            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
        .andDo(print())
        .andExpect(status().isOk())
        .andReturn();

        String responseStr = result.getResponse().getContentAsString();
        dForm = ObjectMapperUtils.jsonToObject(responseStr, DepositForm.class);

        assertNotNull(dForm.getId());

        Movement movement = movementRepository.findById(dForm.getId()).orElse(null);
        assertNotNull(movement);
        assertEquals(dForm.getAmount(), movement.getFinalAmount());
    }

    @Test
    public void fetchFavoredName() throws Exception
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(154);
        user.setCpfCnpj("92386126099");
        user.setEmail("usuario03@email.com.br");
        user.setName("Fernanda Rocha");
        user.setPassword("159357");
        user.setPersonType(PersonType.CPF);
        user.setStateId(22);

        String userJsonStr = ObjectMapperUtils.ObjectToJson(user);
        
        mockMvc.perform(post("/api/user/register")
            .content(userJsonStr).contentType(MediaType.APPLICATION_JSON_VALUE))
        .andDo(print())
        .andExpect(status().isCreated())
        .andReturn();

        User userBD = userRepository.findByCpfCnpj(user.getCpfCnpj()).orElseThrow();

        Account account = userBD.getAccounts().get(0);

        MvcResult result = mockMvc.perform(get("/api/account/fetchFavoredName/"+account.getNumAccount()))
            .andDo(print())
            .andExpect(status().isOk())
            .andReturn();

        String favoredName = result.getResponse().getContentAsString();
        assertFalse(StringUtils.isEmpty(favoredName));
    }

    @Test
    public void getDefaultResponse() throws Exception
    {
        String content = mockMvc.perform(get("/api/server/default-response/public"))
            .andDo(print())
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
        
        DefaultResponse defaultResponse = ObjectMapperUtils.jsonToObject(content, DefaultResponse.class);
        assertThat(defaultResponse).isNotNull();

        assertThat(defaultResponse.getAccountTypes()).hasSize(2);
        assertThat(defaultResponse.getPersonTypes()).hasSize(2);
        assertThat(defaultResponse.getCashTypes()).hasSize(2);
        assertThat(defaultResponse.getLogonTypes()).hasSize(2);
    }
}