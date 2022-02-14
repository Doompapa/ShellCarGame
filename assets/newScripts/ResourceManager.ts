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

    public playCoinSound() {
        const audioSource = this.node.getComponent(AudioSourceComponent);
        if (audioSource) {
            audioSource.playOneShot(this.coinSound);
        }
    }

    public playKnockSound() {
        const audioSource = this.node.getComponent(AudioSourceComponent);
        if (audioSource) {
            audioSource.playOneShot(this.knockSound);
        }
    }
}
