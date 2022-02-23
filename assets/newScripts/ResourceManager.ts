import { _decorator, Component, Node, AudioClip, AudioSourceComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    @property({
        type: AudioClip
    })
    coinSound!: AudioClip;


    @property({
        type: AudioClip
    })
    knockSound!: AudioClip;


    @property({
        type: AudioClip
    })
    eatVshell!: AudioClip;

    @property({
        type: AudioClip
    })
    timer!: AudioClip;


    @property({
        type: AudioClip
    })
    gameOver!: AudioClip;

    private audioSource!: AudioSourceComponent;

    start() {
        let temp = this.node.getComponent(AudioSourceComponent);
        if (temp) {
            this.audioSource = temp;
        }

    }

    public playCoinSound() {
        if (this.audioSource) {
            // this.audioSource.playOneShot(this.coinSound, 0.1);
            this.audioSource.playOneShot(this.coinSound, 0.2);
        }
    }

    public playKnockSound() {
        if (this.audioSource) {
            this.audioSource.playOneShot(this.knockSound, 1.2);
        }
    }

    public playGameOver(){
        if (this.audioSource) {
            this.audioSource.playOneShot(this.gameOver, 1.2);
        }
    }

    public playerTimer(){
        if (this.audioSource) {
            this.audioSource.playOneShot(this.timer, 1);
        }
    }
}
