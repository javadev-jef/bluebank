import React, { useState } from "react";
import Navbar from "../../components/Navbar";

import "./style.scss";
import ContaCard from "../../components/Card/ContaCard";
import ItemConta from "../../components/Card/ContaCard/ItemConta";
import { DateRangePicker, Button } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import {LOCALE_RSDATE, DATE_FORMAT} from "../../constants";
import StatementListTable from "../../components/StatementListTable";
import { useStatements } from "../../hooks/useStatements";

export default function Statement()
{
    const statements = useStatements();

    const [isShowSaldo, setIsShowSaldo] = useState(false);

    const handleVisibleSaldo = () =>
    {
        setIsShowSaldo(!isShowSaldo);
    }
    
    const onSubmitHandler = (event) =>
    {
        event.preventDefault();
        statements.fetch();
    }

    return(
        <div className="statement-container">
            <Navbar />
            <main>
                <ContaCard title="Saldo em conta" handleShowSaldo={handleVisibleSaldo}>
                    <ItemConta label="CC" numConta="1234-1" valueConta="R$ 100,00" show={isShowSaldo}/>
                </ContaCard>
                <fieldset>
                    <legend>Período</legend>
                    <form action="GET" onSubmit={onSubmitHandler}>
                        <select disabled={statements.loading}>
                            <option value="" disabled>Conta</option>
                            <option value="CP">Poupança</option>
                            <option value="CC">Corrente</option>
                        </select>

                        <DateRangePicker 
                            disabled={statements.loading}
                            placeholder="Periodo" 
                            className="rs-datepicker-custom" 
                            locale={LOCALE_RSDATE} 
                            format={DATE_FORMAT}
                        />

                        <Button className="button" type="submit" loading={statements.loading}>Buscar</Button>
                    </form>
                </fieldset>
                <StatementListTable statements={statements}/>
            </main>
        </div>
    );
}