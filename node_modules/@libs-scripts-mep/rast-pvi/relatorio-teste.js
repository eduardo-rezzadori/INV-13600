/**
 * Classe que descreve um relatorio de teste
 * @class
 */
class RelatorioTeste {
    /**
     * @constructs RelatorioTeste
     * @param {string} programa 
     * @param {string} versao 
     * @param {number} setup 
     * @param {number} teste
     * @param {Array} funcional 
     * @param {Array} componente 
     */
    constructor(programa, versao, setup, teste, funcional, componente) {
        this.Programa = programa
        this.Versao = versao
        this.TempoSetup = setup
        this.TempoTeste = teste

        //opcionais
        this.TesteFuncional = funcional ? funcional : []
        this.TesteComponentes = componente ? componente : []
    }

    /**
     * Adiciona um teste funcional ao array de testes funcionais
     * Exemplo:
     * 
     * AddTesteFuncional("COM", "Impossível comunicar", -1, true)
     * @memberof RelatorioTeste
     * @param {string} nome Nome do teste (utilizado na pesquisa. ex : E1, S1 ...)
     * @param {string} descricao Descrição do teste (string longa)
     * @param {number} codFalha Codigo de falha (-1 se nao tem)
     * @param {boolean} resultado True ou False
     */
    AddTesteFuncional(nome, descricao, codFalha, resultado) {
        this.TesteFuncional.push({
            'Nome': nome,
            'Descricao': descricao,
            'Codigo': codFalha,
            'Resultado': resultado
        })
    }

    /**
     * Adiciona um teste de componente ao array de testes de componentes
     * Exemplo:
     * 
     * AddTesteComponente("VccVoltage", -1, 311.2,  311.0, 5, "G", -1, true)
     * @memberof RelatorioTeste
     * @param {string} nome Designator do componente (R1, T1 ...)
     * @param {number} pino Numero do pino (-1 se não tem)
     * @param {number} valorMedido Valor medido (com decimais)
     * @param {number} valorEsperado Valor de referência (com decimais)
     * @param {number} aceitacao Porcentagem de aceitação (+/-)
     * @param {string} etapaMontagem Etapa do componente
     * @param {number} codFalha Codigo de falha (-1 se nao tem)
     * @param {boolean} resultado True ou False
     */
    AddTesteComponente(nome, pino, valorMedido, valorEsperado, aceitacao, etapaMontagem, codFalha, resultado) {
        this.TesteComponentes.push({
            'Pino': pino,
            'Valor': valorMedido,
            'Designator': nome,
            'Referencia': valorEsperado,
            'Aceitacao': aceitacao,
            'Etapa': etapaMontagem,
            'Codigo': codFalha,
            'Resultado': resultado
        })
    }

    /**
     * Ordena alfabeticamente os testes funcionais e de componentes existentes em uma instancia de um RelatorioTeste
     * @param {RelatorioTeste} relatorio 
     */
    static OrdenaRelatorio(relatorio) {

        relatorio.TesteFuncional.sort((a, b) => {
            if (a.Nome < b.Nome) {
                return -1
            }
            if (a.Nome > b.Nome) {
                return 1
            }
            return 0
        })

        relatorio.TesteComponentes.sort((a, b) => {
            if (a.Nome < b.Nome) {
                return -1
            }
            if (a.Nome > b.Nome) {
                return 1
            }
            return 0
        })
    }
}