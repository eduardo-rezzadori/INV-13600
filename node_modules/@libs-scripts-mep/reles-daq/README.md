# Gerenciamento de Relés do DAQ

Biblioteca genérica para acionamento dos relés do DAQ.

## Instalando

Abra o terminal, e na pasta do script, execute:

```
npm i @libs-scripts-mep/reles-daq
```

## Desinstalando

Abra o terminal, e na pasta do script, execute:

```
npm uninstall @libs-scripts-mep/reles-daq
```

## Exemplo de Utilização de Buffers

```js
class TestScript {
    constructor() {
        this.Out = {
            Power: 6,
            InTestSensor: 7,
            ReferenceSensor: 5
        }
        this.BufferReles = []

        this.Run()
    }

    async Run() {
        await this.PowerOn(3000)
        await this.SelectRefSensor(1000)
        await this.SelectInTestSensor(1000)
        await this.PowerOff(0)
    }

    async PowerOn(afterDelay) {
        DAQRelay.AddRelay(this.Out.Power, this.BufferReles)
        return await DAQRelay.TurnOn(this.BufferReles, afterDelay)
    }

    async PowerOff(afterDelay) {
        //limpa o buffer
        DAQRelay.ClearBuffer(this.BufferReles)
        //realiza o desacionamento de todos os relés.
        return await DAQRelay.TurnOn(this.BufferReles, afterDelay)
    }

    async SelectRefSensor(afterDelay) {
        //manipula o buffer adicionando um relé e removendo outro.
        DAQRelay.RemoveRelay(this.Out.InTestSensor, this.BufferReles)
        DAQRelay.AddRelay(this.Out.ReferenceSensor, this.BufferReles)
        //realiza o acionamento dos reles contidos no buffer e o desacionamento dos relés não contidos no buffer.
        return await DAQRelay.TurnOn(this.BufferReles, afterDelay)
    }

    async SelectInTestSensor(afterDelay) {
        DAQRelay.AddRelay(this.Out.InTestSensor, this.BufferReles)
        DAQRelay.RemoveRelay(this.Out.ReferenceSensor, this.BufferReles)
        return await DAQRelay.TurnOn(this.BufferReles, afterDelay)
    }
}
```
