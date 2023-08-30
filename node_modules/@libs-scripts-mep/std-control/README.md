# Controle STD - Smart Test Device (BS-80)

Bibloteca que auxilia no controle dos motores da base STD (BS-80)

## Instalando

Abra o terminal, e na pasta do script, execute:

`npm i @libs-scripts-mep/std-control`

Após finalizada a instalação da biblioteca, inclua em seu html:

```html
<script src="node_modules/@libs-scripts-mep/std-control/std-control.js"></script>
```

> ⚠️Fique atento à ordem de carregamento dos arquivos, as dependências devem ser carregadas ANTES da biblioteca, como no trecho acima.

## Exemplo de Utilização

```js
class TestScript {
    constructor(eventMap, event) {

        //instancia 
        this.STD = new SmartTestDevice(1, 3, "dc4", "dc3", "dc2", "dc1")

        //invoca roteiro de teste
        this.Run()
            .then(async () => {
                //finaliza o teste
            })
            .catch(async (error) => {
                this.STD.MoveUp(5000, false)
                //finaliza o teste
            })
    }

    async Run() {

        //inicia observer da emergência, caso detectado acionamento, executa o then
        this.EmergencyObserver().then((info) => { console.error(info.msg); alert(info.msg); throw null })

        //verifica se motor está na posição inicial
        const moveUpInit = await this.STD.MoveUp()
        if (!moveUpInit.result) { this.RelatorioTeste.AddTesteFuncional("Sobe Motor [Inicio]", moveUpInit.msg, -1, false); throw null }

        //Instrui operador para acionar bimanual [caminho de imagem ficticio]
        await UI.setImage("./Imagens/biman.png")
        await UI.setMsg("Pressione os botões indicados para iniciar o teste")

        //Aguarda acionamento do bimanual (uso opcional, próximo método tem mesma lógica integrada)
        const bimanMonitor = await this.BimanualObserver()
        if (!bimanMonitor.result) { this.RelatorioTeste.AddTesteFuncional("Bimanual", bimanMonitor.msg, -1, false); throw null }

        //aguarda descida do motor por 10s
        const moveDown = await this.STD.MoveDown()
        if (!moveDown.result) { this.RelatorioTeste.AddTesteFuncional("Desce Motor", moveDown.msg, -1, false); throw null }

        //lógica de teste

        //Manda motor subir sem aguardar todo o movimento, e avaça para finalização
        const moveUpEnd = await this.STD.MoveUp()
    }
}
```