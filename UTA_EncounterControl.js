//=============================================================================
// UTA_EncounterControl.js
//=============================================================================

//=============================================================================
/*:
 * @plugindesc Control of the encounter rate with plugin command.
 * It is possible to control at an arbitary timing from the items and skills.
 * @author t-akatsuki
 * 
 * @param Show Trace
 * @desc Set state traces display.
 * @type boolean
 * @on Show trace
 * @off Don't show trace
 * @default false
 * 
 * @param Remain Save and Load
 * @desc Set state of remain effect at save and load.
 * @type boolean
 * @on Enabled
 * @off Disabled
 * @default false
 * 
 * @help # Overview
 * UTA_EncounterControl plugin allows you to control the number of 
 * encounter steps from plugin commands.
 * 
 * This plugin's feature is that it can be excuted at any timing from 
 * common events or map events.
 * 
 * For example, you can control encounter rate to 1/2 at between 100 steps.
 * 
 * Also, it can overlap the effects of class abilities provided by default
 * in RPG Maker MV.
 * 
 * # Parameters
 *   Show Trace <true|false>
 *     Set whether the issue a trace for debugging.
 * 
 *     - Show trace
 *         Show trace for debugging.
 *     - Don't show trace
 *         Don't Show trace for debugging.
 * 
 *   Remain Save and Load <true|false>
 *     Set state of remain effect at save and load.
 * 
 *     - Enabled
 *         Store state of encounter control on savedata, 
 *         and restore it on load.
 *     - Disabled
 *         Don't store state of encounter control on savedata.
 *         Reset state of encounter control on load.
 * 
 * # Plugin Command
 *   EncounterControl set <encounter rate> <remain steps> [callback common event id]
 *     Set the effect of encounter correction.
 * 
 *     <encounter rate> (required): 
 *       Specify rate of encounter correction.
 * 
 *     <remain steps> (required): 
 *       Specify number of steps for encounter correction until effects off.
 *       Encounter correction effects not expire depending on the number of steps 
 *       if you specify -1.
 * 
 *     [callback common event id] (optional): 
 *       ID of the common event that is called when encounter correction effects end.
 *       Don't call common event when encounter correction effects end, 
 *       if you specify 0 or not specify.
 * 
 *   EncounterControl get <target> <variable id>
 *      Get current encounter control value into the variablee with 
 *      the specified number.
 * 
 *      <target> (required): 
 *        rate      : Current encountor corrected value.
 *                    (return 100x value)
 *        remainstep: Current encounter control's remain steps.
 *                    (return 0 when not encounter correction)
 *        callback  : Current end callback common event id.
 *                    (return 0 if not set)
 * 
 *      <variable id> (required): 
 *        Variable id that stores the target value.
 * 
 *   EncounterControl clear
 *     Clear state of encounter correction.
 *     Callback is not called on 'clear' timing.
 * 
 * # Plugin command examples
 *   EncounterControl set 2.0 100 1
 *     Set encounter rate to 2.0x between 100 steps, 
 *     and call common event 1 when encounter correction effects end.
 * 
 *   EncounterControl set 0 -1
 *     Permanently set encounter rate to 0.
 *     If you want to clear it, use 'clear' plugin command.
 * 
 *   EncounterControl get remainstep 20
 *     Store Current encounter control's remain steps value to number 20 variable.
 * 
 *   EncounterControl clear
 *     Clear state of encounter correction.
 * 
 * # Information
 *   Version: 1.1.0
 *   License: MIT License
 *   Web site:
 *   - Official Web site:
 *      https://www.utakata-no-yume.net/
 *   - Plugin page:
 *       https://www.utakata-no-yume.net/gallery/plugin/tkmv/encounter_control/
 *   - Contact:
 *      https://www.utakata-no-yume.net/contact/rpgmvmz/
 *   - GitHub repository:
 *      https://github.com/t-akatsuki/UTA_EncounterControlMV
 * 
 * # Change Log
 *   ver 1.1.0 (Feb 23, 2025)
 *     Implemented measures against competition from other plugins.
 *     Added settings of whether the effect persists between save and load.
 *     Added get plugin command.
 *     Fixed problem where the effect remained when return to title or when game over.
 *     Add JSDoc comments in code. Enhanced type safety.
 *     Improved code readability and help document readability.
 *     Change version number convention to Semantic Versioning 2.0.0.
 * 
 *   ver 1.00 (Feb 17, 2016)
 *     Rename to UTA_CommonSave.js.
 *     To be able to set trace in the parameter.
 * 
 *   ver 0.01+ (Dec 20, 2015)
 *     Fix charactor encode to UTF-8.
 * 
 *   ver 0.01 (Nov 19, 2015)
 *     Initial release.
 */

/*:ja
 * @plugindesc エンカウント歩数の制御を行います。
 * アイテムやスキルから任意のタイミングで制御を行う事ができる様になります。
 * @author 赤月 智平
 * 
 * @param Show Trace
 * @desc デバッグ用のトレースを出すかを設定します。
 * @type boolean
 * @on トレースを表示する
 * @off トレースを表示しない
 * @default false
 * 
 * @param Remain Save and Load
 * @desc セーブ・ロード時に効果を維持するかを設定します。
 * @type boolean
 * @on 効果を維持する
 * @off 効果を維持しない
 * @default false
 * 
 * @help ■概要
 * UTA_EncounterControlプラグインはプラグインコマンドからのエンカウント歩数の
 * 制御を実現します。
 * プラグインコマンドである為、コモンイベントやマップイベントから
 * 任意のタイミングで実行できるのが特長です。
 * 
 * 例えば、アイテムやコモンイベントと併せて使う事ができ、
 * 使用時に100歩の間エンカウント率を1/2にする、といった制御が可能になります。
 * 
 * またRPGツクールMVのデフォルトで用意されているクラスアビリティの効果と
 * 重複させる事が可能です。
 * 
 * ■プラグインパラメータ
 *   Show Trace <true|false>
 *     デバッグ用のトレースを出すかを設定します。
 * 
 *     - トレースを表示する (true)
 *         デバッグ用トレースを表示します。
 *     - トレースを表示しない (false)
 *         デバッグ用トレースを表示しません。
 * 
 *   Remain Save and Load <true|false>
 *     セーブ・ロード時に効果を維持するかを設定します。
 * 
 *     - 効果を維持する (true)
 *         セーブデータにエンカウント制御の状態を保存しロード時に復元します。
 *     - 効果を維持しない (false)
 *         セーブ・ロード時に状態の維持は行いません。
 *         ロード時は補正状態がリセットされます。
 * 
 * ■プラグインコマンド
 *   EncounterControl set <エンカウント補正倍率> <効果歩数> [コールバックコモンイベントID]
 *     エンカウント補正効果を設定します。
 * 
 *     <エンカウント補正倍率> (必須): 
 *       設定するエンカウント補正の倍率を指定します。
 *       例えば、2.0を指定するとエンカウント率は2.0倍になります。
 * 
 *     <効果歩数> (必須): 
 *       エンカウント補正の効果歩数です。
 *       効果歩数歩くと効果切れになります。
 *       -1を指定した場合は歩数による効果切れになりません。
 * 
 *     [コールバックコモンイベントID] (任意): 
 *       エンカウント補正効果終了時に呼ぶコモンイベントのID。
 *       0を指定した場合や指定しない場合は終了時にイベントを呼びません。
 * 
 *   EncounterControl get <対象> <変数番号>
 *     指定した番号の変数に現在のエンカウント補正状態を取得します。
 * 
 *     <対象> (必須): 
 *       rate      : 現在のエンカウント補正値。
 *                   (実際の100倍値が返ります)
 *       remainstep: 現在のエンカウント補正残り歩数。
 *                   (補正無しの場合は0が返ります)
 *       callback  : 現在の効果終了コールバックコモンイベントID。
 *                   (指定していない場合は0が返ります)
 * 
 *     <変数番号> (必須): 
 *       対象の値を格納する変数番号。
 * 
 *   EncounterControl clear
 *     エンカウント制御の状態をクリアします。
 *     クリア時にはコールバックは呼ばれません。
 * 
 * ■プラグインコマンドの使用例
 *   EncounterControl set 2.0 100 1
 *     100歩の間、エンカウント率を2倍にセットし、
 *     効果終了後にコモンイベント1番を実行します。
 * 
 *   EncounterControl set 0 -1
 *     永続的にエンカウント率を0にします。
 *     解除する時はclearプラグインコマンドを利用します。
 * 
 *   EncounterControl get remainstep 20
 *     変数20番にエンカウント補正残り歩数を格納します。
 * 
 *   EncounterControl clear
 *     エンカウント制御の状態をクリアします。
 * 
 * ■各種情報
 *   バージョン: 1.1.0
 *   ライセンス: MIT License
 *   Webサイト: 
 *   - 公式サイト: 
 *       https://www.utakata-no-yume.net/
 *   - プラグイン掲載ページ: 
 *       https://www.utakata-no-yume.net/gallery/plugin/tkmv/encounter_control/
 *   - お問い合わせ: 
 *       https://www.utakata-no-yume.net/contact/rpgmvmz/
 *   - GitHubリポジトリ: 
 *       https://github.com/t-akatsuki/UTA_EncounterControlMV
 * 
 * ■更新履歴
 *   ver 1.1.0 (2025.02.23)
 *     他プラグインとの競合対策を実施。
 *     セーブ・ロードを挟んだ際に効果を持続するかを設定できるように。
 *     現在の補正値などを取得するgetプラグインコマンドを追加。
 *     タイトルに戻るやゲームオーバー時に効果が残ってしまう問題の修正。
 *     コード内のJSDocコメント追加。可読性の向上。型安全性の強化。
 *     ヘルプドキュメントの可読性向上。
 *     バージョン番号規則をセマンティック バージョニング 2.0.0に変更。
 * 
 *   ver 1.00 (2016.02.17)
 *     ファイル名をUTA_EncounterCountrol.jsに変更。
 *     トレース出力の有無をパラメータで設定できるように。
 * 
 *   ver 0.01+ (2015.12.20)
 *     文字エンコードをUTF-8に修正。
 * 
 *   ver 0.01 (2015.11.19)
 *     初版。
 */
//=============================================================================
"use strict";

/**
 * @namespace
 */
var utakata = utakata || {};

(function(utakata) {
    /**
     * @class EncounterControl
     * @classdesc エンカウント制御を管理する静的クラス。
     */
    var EncounterControl = (function() {
        /**
         * @constructor
         */
        function EncounterControl() {
            /**
             * エンカウント率の倍率。
             * @type {number}
             */
            this._rate = 1.0;
            /**
             * 効果の残り歩数。
             * @type {number}
             */
            this._remainStep = 0;
            /**
             * コールバック時に呼ばれるコモンイベントID。
             * @type {number|null}
             */
            this._callbackCommonEventId = null;

            /**
             * トレース表示を有効にするか。
             * @type {boolean}
             */
            this._showTrace = false;

            /**
             * セーブ・ロード時に効果を維持するか。
             * @type {boolean}
             */
            this._remainSaveAndLoad = false;

            this._initialize();
        }

        // Like class variables
        /**
         * プラグインのバージョン。
         * @type {string}
         */
        EncounterControl.prototype.VERSION = "1.1.0";

        /**
         * セーブデータに格納する際の名前空間。
         * @type {string}
         */
        EncounterControl.prototype.SAVE_CONTENTS_NAMESPACE = "UTA_EncounterControl";

        /**
         * 初期化処理。
         * @memberof EncounterControl
         * @private
         * @method
         */
        EncounterControl.prototype._initialize = function() {
            var parameters = PluginManager.parameters("UTA_EncounterControl");

            /**
             * Show Trace
             * トレース表示の設定
             */
            this._showTrace = (String(parameters["Show Trace"]) === "true");

            /**
             * Remain Save and Load
             * セーブ・ロード時に効果を維持するか
             */
            this._remainSaveAndLoad = (String(parameters["Remain Save and Load"]) === "true");

            this.clearParameter();
        };

        /**
         * デバッグトレースの出力。
         * @param {string} message メッセージ文字列。
         */
        EncounterControl.prototype._tr = function(message) {
            if (!this._showTrace) {
                return;
            }
            var logStr = "EncounterControl: " + message;
            console.log(logStr);
        };

        /**
         * エンカウント補正パラメーターの設定。
         * @memberof EncounterControl
         * @method
         * @param {string[]} args プラグインコマンドの引数。
         *                   args[0] : プラグインコマンド名
         *                   args[1] : エンカウント補正率
         *                   args[2] : 効果歩数
         *                   args[3] : 効果終了時のコールバックコモンイベントID (省略可)
         */
        EncounterControl.prototype.setParameter = function(args) {
            // 引数の数が不正な場合はエラーとする
            if (args.length < 3) {
                throw new Error("utakata.EncounterControl: Plugin command arguments are invalid.");
            }

            // エンカウント補正倍率
            var rate = parseFloat(args[1]);
            if (rate !== rate) {
                throw new Error("utakata.EncounterControl: Plugin command argument rate is invalid.");
            }
            // 効果歩数
            var step = parseInt(args[2], 10);
            if (step !== step) {
                throw new Error("utakata.EncounterControl: Plugin command argument step is invalid.");
            }

            // コールバックコモンイベントID(省略可)
            var endCallbackCommonEventId = null;
            if (args.length >= 4) {
                endCallbackCommonEventId = parseInt(args[3], 10);
                if (endCallbackCommonEventId !== endCallbackCommonEventId) {
                    throw new Error("utakata.EncounterControl: Plugin command argument callback is invalid.");
                }
            }

            this._setParameterCore(rate, step, endCallbackCommonEventId);
            return true;
        };

        /**
         * @memberof EncounterControl
         * @private
         * @method
         * @param {number} rate エンカウント補正倍率
         * @param {number} step 効果歩数。
         * @param {number|null} endCallbackCommonEventId コールバックコモンイベントID。
         *                                               nullの場合はコールバックは呼ばれない。
         */
        EncounterControl.prototype._setParameterCore = function(rate, step, endCallbackCommonEventId) {
            if (endCallbackCommonEventId === undefined) {
                endCallbackCommonEventId = null;
            }

            this._tr("setParameter: rate = " + rate + ", step = " + step + ", callbackCommonEventId = " + endCallbackCommonEventId);

            // エンカウント補正率は小数点2桁までの精度とする
            this._rate = Math.floor(rate * 100) / 100;
            this._remainStep = Math.floor(step);

            // コールバックが指定されていない場合
            if (endCallbackCommonEventId === null) {
                this._callbackCommonEventId = null;
                return;
            }

            // 存在しないコールバックコモンイベントのIDを指定した場合はコールバック無しとする
            // セーブ・ロード時にコモンイベントが消されてしまった場合に詰んでしまうのを防ぐ
            if (endCallbackCommonEventId >= 1 && endCallbackCommonEventId < $dataCommonEvents.length - 1) {
                this._callbackCommonEventId = endCallbackCommonEventId;
            } else {
                this._callbackCommonEventId = null;
                console.warn("utakata.EncounterControl: Specified common event ID is out of range. (callbackCommonEventId = " + endCallbackCommonEventId);
            }
        };

        /**
         * エンカウント補正パラメーターをクリアし初期状態に戻す。
         * @memberof EncounterControl
         * @method
         */
        EncounterControl.prototype.clearParameter = function() {
            this._tr("clearParameter");
            this._rate = 1.0;
            this._remainStep = 0;
            this._callbackCommonEventId = null;
        };

        /**
         * エンカウント補正終了時のコールバックを呼び出す。
         * @memberof EncounterControl
         * @private
         * @method
         */
        EncounterControl.prototype._callEndCallback = function() {
            if (!this._callbackCommonEventId) {
                return;
            }
            $gameTemp.reserveCommonEvent(this._callbackCommonEventId);
        };

        /**
         * 残り効果歩数の更新。
         * @memberof EncounterControl
         * @method
         */
        EncounterControl.prototype.updateRemainStep = function() {
            // 補正中で無い場合やイベント中は何もしない
            if ($gameMap.isEventRunning() || !utakata.EncounterControl.isEnabled()) {
                return;
            }
    
            if (this._remainStep > 0) {
                this._remainStep--;

                // 効果終了時の処理
                if (this._remainStep == 0) {
                    // コールバックの呼び出し
                    this._callEndCallback();

                    // パラメータのクリア
                    this.clearParameter();
                }
            }
        };

        /**
         * エンカウント補正をかけた倍率値を取得する。
         * エンカウント補正中でない場合は補正せずそのままの値を返す。
         * @param {number} value 元となるエンカウント倍率値。
         * @return {number} 補正後のエンカウント倍率値。
         */
        EncounterControl.prototype.updateEncounterProgressValue = function(value) {
            // エンカウント補正中でない場合は補正しない
            if (!utakata.EncounterControl.isEnabled()) {
                return value;
            }
            return value * this.getRateValue();
        };

        /**
         * セーブデータ格納データを作成する。
         * @memberof EncounterControl
         * @private
         * @method
         * @return {object} セーブデータ格納データ。
         */
        EncounterControl.prototype._makeSaveContents = function() {
            var contents = {
                "version": this.VERSION,
                "rate": this._rate,
                "remainStep": this._remainStep,
                "callbackCommonEventId": this._callbackCommonEventId,
            };
            return contents;
        };

        /**
         * セーブ格納データにエンカウント制御のデータを追加する。
         * @param {object} contents セーブデータに格納するデータ連想配列。
         * @return {object} セーブデータに格納するデータ連想配列。
         */
        EncounterControl.prototype.appendSaveContents = function(contents) {
            // セーブ・ロード効果維持しない場合は何もしない
            if (!utakata.EncounterControl.isRemainSaveAndLoad()) {
                return;
            }

            // 名前空間が存在しない場合は作成する
            if (Object.keys(contents).indexOf("utakata") < 0) {
                contents.utakata = {};
            }

            // エンカウント制御のセーブデータを格納する
            var encounterContents = utakata.EncounterControl._makeSaveContents();
            contents.utakata[utakata.EncounterControl.SAVE_CONTENTS_NAMESPACE] = encounterContents;

            return contents;
        };

        /**
         * セーブデータからデータを読み込み復元する。
         * @param {object} contents セーブデータから読み込んだデータ。
         */
        EncounterControl.prototype.extractSaveContents = function(contents) {
            // ロード時に意図せず効果が残留しないように一旦状態を初期化
            this.clearParameter();

            // セーブ・ロード効果維持しない場合は何もしない
            if (!this._remainSaveAndLoad) {
                return;
            }

            // セーブデータにエンカウント制御のデータが含まれている場合は復元する
            if (Object.keys(contents).indexOf("utakata") >= 0) {
                var utakataContents = contents.utakata;

                if (Object.keys(utakataContents).indexOf(this.SAVE_CONTENTS_NAMESPACE) >= 0) {
                    try {
                        var encounterContents = utakataContents[this.SAVE_CONTENTS_NAMESPACE];

                        var version = encounterContents.version;
                        var rate = encounterContents.rate;
                        var remainStep = encounterContents.remainStep;
                        var callbackCommonEventId = encounterContents.callbackCommonEventId;

                        // 読み込んだデータを基に状態を復元する
                        this._setParameterCore(rate, remainStep, callbackCommonEventId);

                        this._tr("extractSaveContents: version = " + version + ", rate = " + rate + ", remainStep = " + remainStep + ", callbackCommonEventId = " + callbackCommonEventId);
                    } catch (e) {
                        // 読み込みに失敗した場合はロードせずに何もしない
                        console.error("EncounterControl.extractSaveContents: Failed to load data from savedata.");
                        console.error(e);
                    }
                }
            }
        };

        /**
         * プラグインコマンドgetの実処理。
         * 指定した変数に現在の対象パラメーター値を格納する。
         * @memberof EncounterControl
         * @private
         * @method
         * @param {string} target 取得対象。以下のどれか。
         *          rate      : 現在のエンカウント補正率(100倍値)
         *          remainstep: 現在のエンカウント補正残り歩数。
         *          callback  : 現在のコールバックコモンイベントID。
         * @param {number} variableId 結果を格納する変数の番号。
         */
        EncounterControl.prototype._getCore = function(target, variableId) {
            // 指定した変数IDが範囲外の場合はエラーとする
            if (variableId <= 0 || variableId > $dataSystem.variables.length - 1) {
                throw new RangeError("utakata.EncounterControl: Invalid argument. Variable id is out of range.");
            }

            // 取得対象を変数に格納する
            switch (target) {
                case "rate":
                    // ツクールの変数は整数前提の為100倍値を返す
                    var correctedRate = Math.floor(this._rate * 100);
                    $gameVariables.setValue(variableId, correctedRate);
                    break;
                case "remainstep":
                    $gameVariables.setValue(variableId, this._remainStep);
                    break;
                case "callback":
                    $gameVariables.setValue(variableId, this._callbackCommonEventId || 0);
                    break;
                default:
                    // 取得対象が不正な場合はエラー
                    throw new Error("utakata.EncounterControl: Invalid argument in get plugin command. type is invalid.");
            }
        };

        /**
         * プラグインコマンドget処理。
         * @memberof EncounterControl
         * @method
         * @param {string[]} args プラグインコマンド引数。
         *      args[1]: 取得対象。
         *      args[2]: 取得した値を格納する変数の番号。
         */
        EncounterControl.prototype.get = function(args) {
            var target = "";
            var variableId = 0;

            // プラグインコマンド引数が不正な場合はエラーとする
            try {
                target = args.length >= 2 ? args[1] : "";
                target = target.toLowerCase();

                if (args.length < 3) {
                    throw new Error("utakata.EncounterControl: Invalid argument in get plugin command. variable id is required.");
                }

                variableId = parseInt(args[2], 10);
                if (variableId !== variableId) {
                    throw new TypeError("utakata.EncounterControl: Invalid argument in get plugin command. variable id is invalid.");
                }

                this._getCore(target, variableId);
            } catch (e) {
                console.error("EncounterControl.extractSaveContents.get: Ditect invalid arguments. (" + JSON.stringify(args) + ")");
                console.error(e);
                throw e;
            }
        };

        /**
         * エンカウント補正中かどうかを取得する。
         * @memberof EncounterControl
         * @method
         * @return {boolean} エンカウント補正中の場合はtrue。
         */
        EncounterControl.prototype.isEnabled = function() {
            // -1の場合は永続的に補正がかかる
            return this._remainStep != 0;
        };

        /**
         * エンカウント補正率を取得する。
         * @memberof EncounterControl
         * @method
         * @return {number} エンカウント補正率。
         */
        EncounterControl.prototype.getRateValue = function() {
            return this._rate;
        };

        /**
         * 残り効果歩数を取得する。
         * @memberof EncounterControl
         * @method
         * @return {number} 残り効果歩数。
         */
        EncounterControl.prototype.getRemainStep = function() {
            return this._remainStep;
        };

        /**
         * セーブ・ロード時に効果を維持するかを取得する。
         * @memberof EncounterControl
         * @method
         * @return {boolean} 効果を維持する場合はtrue。
         */
        EncounterControl.prototype.isRemainSaveAndLoad = function() {
            return this._remainSaveAndLoad;
        };

        return EncounterControl;
    })();
    utakata.EncounterControl = new EncounterControl();

    //-----------------------------------------------------------------------------
    // Game_Interpreter
    //-----------------------------------------------------------------------------
    // parse and dispatch plugin command
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === "EncounterControl") {
            switch (args[0]) {
                case "set":
                    utakata.EncounterControl.setParameter(args);
                    break;
                case "get":
                    utakata.EncounterControl.get(args);
                    break;
                case "clear":
                    utakata.EncounterControl.clearParameter();
                    break;
                default:
                    break;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Party
    //-----------------------------------------------------------------------------
    /**
     * v1.1.0
     * 他プラグインにてGame_player.prototype.updateなどの破壊的変更がある場合に動作しない事がある模様
     * これに対応する為、Game_playerへのフックを廃止し、Game_Partyへのフックに変更する
     */
    var _Game_Party_increaseSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function() {
        _Game_Party_increaseSteps.call(this);
        utakata.EncounterControl.updateRemainStep();
    };

    //-----------------------------------------------------------------------------
    // Game_Player
    //-----------------------------------------------------------------------------
    var _Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
    Game_Player.prototype.encounterProgressValue = function() {
        var value = _Game_Player_encounterProgressValue.call(this);
        var correttedValue = utakata.EncounterControl.updateEncounterProgressValue(value);
        return correttedValue;
    };

    //-----------------------------------------------------------------------------
    // DataManager
    //-----------------------------------------------------------------------------
    // セーブデータの作成時にエンカウント制御のデータを追加する
    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents.call(this);

        utakata.EncounterControl.appendSaveContents(contents);
        return contents;
    };

    // セーブデータの展開時にエンカウント制御のデータを復元する
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        utakata.EncounterControl.extractSaveContents(contents);
    };

    // ニューゲーム時にエンカウント制御のデータを初期化する
    var DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        DataManager_setupNewGame.call(this);
        utakata.EncounterControl.clearParameter();
    };

})(utakata);
