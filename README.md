# UTA_EncounterControlプラグイン

## ■概要 : Overview
任意のタイミングでエンカウント率の制御を行えるようにするRPGツクールMV用プラグインです。

プラグインコマンドである為、コモンイベントやマップイベントから任意のタイミングで実行できるのが特長です。

例えば、アイテムやコモンイベントと併せて使う事ができ、使用時に100歩の間エンカウント率を1/2にする、といった制御が可能になります。

またRPGツクールMVのデフォルトで用意されているクラスアビリティの効果と重複させる事が可能です。

※本プラグインはRPGツクールMV用の為、RPGツクールMZでの動作を補償しておりません。

## ■利用方法 : Usage
ご自身のプロジェクトに「UTA_EncounterControl.js」を配置し、プラグインの有効化してください。  
イベントコマンドから「プラグインコマンド」を設定してご利用ください。

詳しい利用方法はプラグインのヘルプを参照してください。  
またWebサイトにも解説を掲載しておりますので参考にしてください。

https://www.utakata-no-yume.net/gallery/rpgmv/plugin/encounter_control/

## ■プラグインパラメーター : Plugin Parameters
詳しい説明・利用方法はプラグインヘルプを参照してください。

### Show Trace <true|false>
デバッグ用のトレースを出すかを設定します。

### Remain Save and Load <true|false>
セーブ・ロード時に効果を維持するかを設定します。

## ■プラグインコマンド : Plugin Commands
詳しい説明・利用方法はプラグインヘルプを参照してください。

### EncounterControl set <エンカウント補正倍率> <効果歩数> [コールバックコモンイベントID]
エンカウント補正効果を設定します。

### EncounterControl get <対象> <変数番号>
指定した番号の変数に現在のエンカウント補正状態を取得します。

### EncounterControl clear
エンカウント制御の状態をクリアします。  
クリア時にはコールバックは呼ばれません。

## ■ライセンス/利用規約 : License
本プラグインはMIT Licenseです。

配布、変更、商用利用は可能でありますが、ソフトウェアの著作権表示と、MIT Licenseの全文もしくは全文を掲載したWebページのURLを、ソースコードの中や、ライセンス表示用の別ファイルに掲載して下さい。

これらソフトウェアには何の保障もありません。  
例え、これらのソフトウェアを利用した事で何か問題が起こったとしても、作者は何の責任も負いません。

- 商用/非商用問わずにご利用いただけます。
- 年齢制限のあるコンテンツのご利用についての制限はありません。
- 作品のリリースの際にはご報告いただけると作者が喜びます。(任意です)

## ■更新履歴 : Change Log
### ver 1.1.0 (2025.02.22)
- 他プラグインとの競合対策を実施。
- セーブ・ロードを挟んだ際に効果を持続するかを設定できるように。
- 現在の補正値などを取得するgetプラグインコマンドを追加。
- タイトルに戻るやゲームオーバー時に効果が残ってしまう問題の修正。
- コード内のJSDocコメント追加。可読性の向上。型安全性の強化。
- ヘルプドキュメントの可読性向上。
- バージョン番号規則をセマンティック バージョニング 2.0.0に変更。

### ver 1.00 (2016.02.17)
- ファイル名をUTA_EncounterCountrol.jsに変更。
- トレース出力の有無をパラメータで設定できるように。

### ver 0.01+ (2015.12.20)
- 文字エンコードをUTF-8に修正。

### ver 0.01 (2015.11.19)
- 初版。

## ■連絡先 : Content Information

|  |  |
|:---:|:---|
| Author | 赤月 智平(t-akatsuki) |
| WebSite | https://www.utakata-no-yume.net |
| GitHub | https://github.com/T-Akatsuki |
| X | [@T_Akatsuki](https://x.com/t_akatsuki) |
| Bluesky | [@t-akatsuki.utakata-no-yume.net](https://bsky.app/profile/t-akatsuki.utakata-no-yume.net) |
