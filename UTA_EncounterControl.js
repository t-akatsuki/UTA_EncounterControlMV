//=============================================================================
// UTA_EncounterControl.js
//=============================================================================
// Version    : 1.1.0
// LastUpdate : 2016.02.17
// Author     : T.Akatsuki
// Website    : http://utakata-no-yume.net/
// License    : MIT License(http://opensource.org/licenses/mit-license.php)
//=============================================================================

//=============================================================================
/*:
 * @plugindesc This plugin control of the encounter number of step.
 * It becomes as it is possible to perfom control at an arbitary timing from the items and skills.
 * @author T.Akatsuki
 * 
 * @param Show Trace
 * @desc Set state traces display.
 * true  : Show trace., false : Don't show trace.
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
 * When you run this plugin command canbe done to control encounter at any time.
 * For example, encounter rate can be set to half between 100 steps.
 * You can run at any time from common events and map events.
 * Moreover, it is possible to duplicate class abilites that are provided by default of RPG Maker MV.
 * 
 * # Parameters
 *   Show Trace [true|false]
 *     Set whether the issue a trace for debugging.
 * 
 *   Remain Save and Load [true|false]
 *     Set state of remain effect at save and load.
 *     If you set to true, store state of encounter control on savedata, and restore it when load.
 * 
 * # Plugin Command
 *   EncounterControl set [magnification] [steps] [callback]
 *                                     # This script set to Encounter rate twice between 100 step.
 * 
 *   EncounterControl get <target> <variable-id>
 *      Get current encounter control value into the variablee with the specified number.
 *      Specify one of following for <target>.
 *        rate      : Current encountor corrected value(100x value)
 *        remainstep: Current encounter control's remain steps.(0 when non effedted)
 *        callback  : Current end callback common event id.(0 if not set)
 * 
 *   EncounterControl clear            # state of control encounter.
 *                                     # callback function is not called on clear timing.
 * 
 * # Example
 *   EncounterControl set 2.0 100 1
 *    # Between 100 steps, to set encounter rate twice.
 *    # and start no.1 common event after the effect the end.
 *   EncounterControl set 0 -1
 *    # Permanently to encounter rate to 0.
 * 
 * # Change Log
 *   ver 1.00 (Fed 17, 2016)
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
 * true: トレースを表示, false: トレースを表示しない
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
 * EncounterControlプラグインを利用するにはプラグインコマンドから実行します。
 * プラグインコマンドを実行するとエンカウント歩数の制御を任意のタイミングで行えます。
 * 例えば、100歩の間エンカウント率を1/2にする、といった制御が可能になります。
 * コモンイベントやマップイベントから任意のタイミングで実行できます。
 * またRPGツクールMVのデフォルトで用意されているクラスアビリティの効果と重複させる事が可能です。
 * 
 * ■パラメータの説明
 *   Show Trace [true|false]
 *     デバッグ用のトレースを出すかを設定します。
 * 
 *   Remain Save and Load [true|false]
 *     セーブ・ロード時に効果を維持するかを設定します。
 *     trueに設定するとセーブデータにエンカウント制御の状態を保存し、ロード時に復元します。
 * 
 * ■プラグインコマンド
 *   EncounterControl set [倍率] [歩数] [コールバック]  # 100歩の間エンカウント率を2倍にセットし、効果終了時にコモンイベント1番を起動。
 * 
 *   EncounterControl get <対象> <変数番号>
 *      指定した番号の変数に現在のエンカウント補正状態を取得します。
 *      <対象>には以下の何れかを指定します。
 *        rate      : 現在のエンカウント補正値(実際の100倍値が返ります)
 *        remainstep: 現在のエンカウント補正残り歩数。(補正無しの場合は0が返ります)
 *        callback  : 現在の効果終了コールバックコモンイベントID。(指定していない場合は0が返ります)
 * 
 *   EncounterControl clear                             # エンカウント制御の状態をクリアします。
 *                                                      # クリア時にはコールバックは呼ばれません。
 * 
 * ■使用例
 *   EncounterControl set 2.0 100 1
 *     # 100歩の間、エンカウント率を2倍にセットし、効果終了後にコモンイベント1番を起動する。
 *   EncounterControl set 0 -1
 *     # 永続的にエンカウント率を0にする。
 * 
 * ■更新履歴
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

            this._callbackCommonEventId = endCallbackCommonEventId;
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
            if (!Object.keys(contents).indexOf("utakata") < 0) {
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
