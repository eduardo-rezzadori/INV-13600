# Rastreamento PVI

Biblioteca que manipula eventos de rastreamento através do PVI

## Instalando

Abra o terminal, e na pasta do script, execute:

```
npm i @libs-scripts-mep/rast-pvi
```

Após fianlizada a instalação da biblioteca, inclua em seu html:

```html
	<script src="node_modules/@libs-scripts-mep/rast-pvi/rast-pvi.js"></script>
	<script src="node_modules/@libs-scripts-mep/rast-pvi/relatorio-teste.js"></script>
```

## Desinstalando

Abra o terminal, e na pasta do script, execute:

```
npm uninstall @libs-scripts-mep/rast-pvi
```

## Controle de fluxo

O controle de fluxo serve para impedir que uma peça seja retestada se já tiver erro apontado no rast, para retestar é necessário um apontamento de conserto, ou se a mesma já possuir apontamento de sucesso, não será retestada sem um apontamento de revisão.
A partir da versão 4.7.0.0 do PVI, ele é capaz de controlar o fluxo do processo. Para habilitar é necessário mandar uma variável do tipo `boolean` como parametro, veja o exemplo abaixo:

``` javascript
// variavel que habilita o controle de fluxo a partir do PVI, 'true' para habilitado
const fluxControl = true
const rastInitSucess = await this.Rast.init(fluxControl)
```

> o método atribui por default o valor `false` à essa variável, então não se preocupe caso não for utilizar


## Crontrole de finalização do rastreamento

Apartir da versão 3.1.0, é possível controlar a finalização do rastremento na inicialização do número de série, adicionando '```**```' no inicio/final inserido no prompt. 

![Image](https://i.imgur.com/ix7xAfM.png)


## Exemplo de Utilização

``` js
class TestScript {
    constructor(eventMap, event) {

        this.RelatorioTeste = new RelatorioTeste()
        this.EventMap = eventMap
        this.Event = event

        this.Run().then(async () => {

            RelatorioTeste.OrdenaRelatorio(this.TestReport)
            this.Rast.setReport(this.RelatorioTeste)
            const rastEndSucess = await this.Rast.end(RastUtil.evalReport(this.RelatorioTeste))
            if (!rastEndSucess) { throw this.Rast.EndInfo.Message }

            UI.displayReport(this.RelatorioTeste)

        }).catch((error) => {
            this.RelatorioTeste.AddTesteFuncional("Exception", error, -1, false)
            UI.displayReport(this.RelatorioTeste)
        })
    }

    async Run() {

        UI.setMsg("Iniciando rastreamento...")

        if(RastUtil.isFirstExec()){
            //instruções iniciais
        }
        
        RastUtil.setValidations(RastUtil.ENABLED, RastUtil.ENABLED, RastUtil.ENABLED, RastUtil.DISABLED)
        this.Rast = new RastPVI(this.EventMap, this.Event)

        await RastUtil.setOperador()
        await this.Rast.setSerialNumber()

        const rastInitSucess = await this.Rast.init()
        if (!rastInitSucess) { this.TestReport.AddTesteFuncional("Rastreamento Init", this.Rast.InitInfo.Message, -1, false); return }
        UI.setTitle(this.Rast.InitInfo.item.OpInfo.Product.Name)
        const finalFirmwarePath = this.Rast.InitInfo.item.OpInfo.OpProcesses.find(process => process.ID == "TF").Firmware
    }
}
```