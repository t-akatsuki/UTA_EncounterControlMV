# UTA_EncounterControlプラグイン

## ■概要 : Overview
アイテムやスキルから任意のタイミングでエンカウント率の制御を行うRPGツクールMV用プラグインです。

## ■利用方法 : Usage
ご自身のプロジェクトにUTA_EncounterControl.jsを配置し、プラグインの有効化して下さい。  
本プラグインはプラグインコマンドから利用します。  
例えば、100歩の間エンカウント率を1/2にする、といった制御が可能になります。  
コモンイベントやマップイベントから任意のタイミングで実行できます。  
またRPGツクールMVのデフォルトで用意されているクラスアビリティの効果と重複させる事が可能です。  

詳しい利用方法はWebサイトに掲載しておりますのでご一読下さい。  
https://www.utakata-no-yume.net/gallery/rpgmv/plugin/encounter_control/

## ■プラグインパラメーター : Plugin Parameters
### Show Trace
デバッグ用のトレースをコンソールに出力するかを設定します。

| 指定値 | 説明 |
|:---:|:---|
| true | トレースを表示, |
| false | トレースを表示しない。 |

## ■プラグインコマンド : Plugin Commands
### EncounterControl set Magnification Steps Callback
エンカウント率補正をセットします。  
エンカウント率補正率と効果歩数、効果終了後に実行するコモンイベントの番号を指定します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| Magnification | number | エンカウント率の倍率を指定します。 |
| Steps | number | エンカウント率補正の有効歩数を指定します。 |
| Callback | number | 効果終了時に起動するコモンイベントの番号を指定します。 |

### EncounterControl clear
エンカウント制御の状態をクリアします。  
クリア時にはコールバックに設定したコモンイベントは実行されません。

## ■更新履歴 : Change Log
### ver 1.00 (2016.02.17)
ファイル名をUTA_EncounterCountrol.jsに変更。  
トレース出力の有無をパラメータで設定できるように。
### ver 0.01+ (2015.12.20)
文字エンコードをUTF-8に修正。
### ver 0.01 (2015.11.19)
初版。

## ■ライセンス/利用規約 : License
本プラグインは[MIT License](LICENSE)です。  
商用/非商用問わずにご利用いただけます。

## ■連絡先 : Content Information

|  |  |
|:---:|:---|
| Author | 赤月 智平(T.Akatsuki) |
| WebSite | https://www.utakata-no-yume.net |
| Twitter | [@T_Akatsuki](https://twitter.com/t_akatsuki) |
| GitHub | https://github.com/T-Akatsuki |
