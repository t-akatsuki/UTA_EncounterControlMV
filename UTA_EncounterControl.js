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
            this.progressValue = 1.0;
            /**
             * 効果の残り歩数。
             * @type {number}
             */
            this.remainStepCnt = 0;
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
            this._tr = null;

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

            this._tr = function(s) {
                if (!this._showTrace) {
                    return;
                }
                var logStr = "EncounterControl: " + s;
                console.log(logStr);
            };

            /**
             * Remain Save and Load
             * セーブ・ロード時に効果を維持するか
             */
            this._remainSaveAndLoad = (String(parameters["Remain Save and Load"]) === "true");

            this.clearParameter();
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
            var progress = parseFloat(args[1]);
            if (progress !== progress) {
                throw new Error("utakata.EncounterControl: Plugin command argument progress is invalid.");
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

            this._setParameterCore(progress, step, endCallbackCommonEventId);
            return true;
        };

        /**
         * @memberof EncounterControl
         * @private
         * @method
         * @param {number} progress エンカウント補正倍率
         * @param {number} step 効果歩数。
         * @param {number|null} endCallbackCommonEventId コールバックコモンイベントID。
         *                                               nullの場合はコールバックは呼ばれない。
         */
        EncounterControl.prototype._setParameterCore = function(progress, step, endCallbackCommonEventId) {
            if (endCallbackCommonEventId === undefined) {
                endCallbackCommonEventId = null;
            }

            this._tr("setParameter: progress = " + progress + ", step = " + step + ", callbackCommonEventId = " + endCallbackCommonEventId);

            // エンカウント補正率は小数点2桁までの精度とする
            this.progressValue = Math.floor(progress * 100) / 100;
            this.remainStepCnt = Math.floor(step);

            this._callbackCommonEventId = endCallbackCommonEventId;
        };

        /**
         * エンカウント補正パラメーターをクリアし初期状態に戻す。
         * @memberof EncounterControl
         * @method
         */
        EncounterControl.prototype.clearParameter = function() {
            this._tr("clearParameter");
            this.progressValue = 1.0;
            this.remainStepCnt = 0;
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
        EncounterControl.prototype.updateRemainStepCount = function() {
            if (this.remainStepCnt > 0) {
                this.remainStepCnt--;

                // 効果終了時の処理
                if (this.remainStepCnt == 0) {
                    // コールバックの呼び出し
                    this._callEndCallback();

                    // パラメータのクリア
                    this.clearParameter();
                }
            }
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
                "progress": this.progressValue,
                "remainStep": this.remainStepCnt,
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
                        var progress = encounterContents.progress;
                        var remainStep = encounterContents.remainStep;
                        var callbackCommonEventId = encounterContents.callbackCommonEventId;

                        // 読み込んだデータを基に状態を復元する
                        this._setParameterCore(progress, remainStep, callbackCommonEventId);

                        this._tr("extractSaveContents: version = " + version + ", progress = " + progress + ", remainStep = " + remainStep + ", callbackCommonEventId = " + callbackCommonEventId);
                    } catch (e) {
                        // 読み込みに失敗した場合はロードせずに何もしない
                        console.error("EncounterControl.extractSaveContents: Failed to load data from savedata.");
                        console.error(e);
                    }
                }
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
            return this.remainStepCnt != 0;
        };

        /**
         * エンカウント補正率を取得する。
         * @memberof EncounterControl
         * @method
         * @return {number} エンカウント補正率。
         */
        EncounterControl.prototype.getProgressValue = function() {
            return this.progressValue;
        };

        /**
         * 残り効果歩数を取得する。
         * @memberof EncounterControl
         * @method
         * @return {number} 残り効果歩数。
         */
        EncounterControl.prototype.getRemainStepCount = function() {
            return this.remainStepCnt;
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
        if (!$gameMap.isEventRunning() && utakata.EncounterControl.isEnabled()) {
            utakata.EncounterControl.updateRemainStepCount();
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Player
    //-----------------------------------------------------------------------------
    var _Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
    Game_Player.prototype.encounterProgressValue = function() {
        var value = _Game_Player_encounterProgressValue.call(this);
        if (utakata.EncounterControl.isEnabled()) {
            value *= utakata.EncounterControl.getProgressValue();
        }
        return value;
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
