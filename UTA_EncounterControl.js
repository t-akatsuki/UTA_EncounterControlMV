//=============================================================================
// EncounterControl.js
//=============================================================================
// Version    : 0.01
// LastUpdate : 2015.11.08
// Website    : http://utakata-no-yume.net/
// License    : MIT License(http://opensource.org/licenses/mit-license.php)
//=============================================================================

//=============================================================================
/*:
 * @plugindesc This plugin control of the encounter number of step.
 * It becomes as it is possible to perfom control at an arbitary timing from the items and skills.
 * @author T.Akatsuki
 * 
 * @help When you run this plugin command canbe done to control encounter at any time.
 * For example, encounter rate can be set to half between 100 steps.
 * You can run at any time from common events and map events.
 * Moreover, it is possible to duplicate class abilites that are provided by default of RPG Maker MV.
 * 
 * Plugin command: 
 * EncounterControl set 2.0 100 1    # This script set to Encounter rate twice between 100 step.
 * EncounterControl clear            # state of control encounter.
 *                                   # callback function is not called on clear timing.
 */

/*:ja
 * @plugindesc エンカウント歩数の制御を行います。
 * アイテムやスキルから任意のタイミングで制御を行う事ができる様になります。
 * @author 赤月 智平
 * 
 * @help プラグインコマンドを実行するとエンカウント歩数の制御を任意のタイミングで行えます。
 * 例えば、100歩の間エンカウント率を1/2にする、といった制御が可能になります。
 * コモンイベントやマップイベントから任意のタイミングで実行できます。
 * またRPGツクールMVのデフォルトで用意されているクラスアビリティの効果と重複させる事が可能です。
 * 
 * プラグインコマンド: 
 * EncounterControl set 2.0 100 1    # 100歩の間エンカウント率を2倍にセットし、効果終了時にコモンイベント1番を起動。
 * EncounterControl clear            # エンカウント制御の状態をクリアします。
 *                                   # クリア時にはコールバックは呼ばれません。
 * 
 * (例) EncounterControl set 2.0 100 1
 *      # 100歩の間、エンカウント率を2倍にセットし、効果終了後にコモンイベント1番を起動する。
 *      EncounterControl set 0 -1
 *      # 永続的にエンカウント率を0にする。
 */
//=============================================================================

//name space
var utakata = utakata || (utakata = {});

(function(utakata){
    var EncounterControl = (function(){
        //constructor
        function EncounterControl(){
            this.progressValue = 0;
            this.remainingStepCnt = 0;
            this.endCallback = null;
            
            this._tr = function(s){ var str = "EncounterControl: " + s; console.log(str); } || function(s){ };

            this.initialize();
        }

        //member methods
        EncounterControl.prototype.initialize = function(){
            this.progressValue = 1.0;
            this.remainingStepCnt = 0;
            this.endCallback = null;
        };

        EncounterControl.prototype.setParameter = function(args){
            //parse
            if(args.length < 3){
                this._tr("setParameter: args is invalid.");
                return false;
            }

            var progress = parseFloat(args[1]);
            var step     = parseInt(args[2]);

            var endCallback = args[3] ? parseInt(args[3]) : null;

            this._setParameterCore(progress, step, endCallback);
            return true;
        };

        EncounterControl.prototype._setParameterCore = function(progress, step, endCallback){
            this._tr("setParameter: progress = " + progress + ", step = " + step);

            var progressValue = Math.floor(progress * 100) / 100;
            var stepValue     = Math.floor(step);

            this.progressValue = progressValue;
            this.remainingStepCnt = stepValue;

            if(!endCallback){ return; }
            if(typeof endCallback === "string"){ endCallback = parseInt(endCallback); }
            this.setEndCallback(endCallback);
        };

        EncounterControl.prototype.setEndCallback = function(cmnEvId){
            this.endCallback = function(){ $gameTemp.reserveCommonEvent(cmnEvId); }
        };

        EncounterControl.prototype.clearParameter = function(){
            this._tr("clearParameter");
            this.progressValue = 1.0;
            this.remainingStepCnt = 0;
            this.endCallback = null;
        };

        EncounterControl.prototype.updateRemainingStepCount = function(){
            if(this.remainingStepCnt > 0){
                this.remainingStepCnt--;
                //this._tr("updateRemainingStepCount: " + this.remainingStepCnt);
                if(this.remainingStepCnt == 0){
                    //call back common event
                    if(typeof this.endCallback === "function"){
                        this.endCallback();
                    }
                    this.clearParameter();
                }
            }
        };

        EncounterControl.prototype.isEnabled = function(){
            return this.remainingStepCnt != 0;
        };

        EncounterControl.prototype.getProgressValue = function(){
            return this.progressValue;
        };

        EncounterControl.prototype.getRemainingStepCount = function(){
            return this.remainingStepCnt;
        };

        return EncounterControl;
    })();

    utakata.EncounterControl = new EncounterControl();
}(utakata || (utakata = { }) ));


(function(){
    //-----------------------------------------------------------------------------
    // parse and dispatch plugin command
    //-----------------------------------------------------------------------------
    var _Game_Interpreter_pluginCommand = 
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command === 'EncounterControl'){
            switch(args[0]){
                case 'set':
                    utakata.EncounterControl.setParameter(args);
                    break;
                case 'clear':
                    utakata.EncounterControl.clearParameter();
                    break;
                default:
                    break;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Player
    //-----------------------------------------------------------------------------
    var _Game_Player_encounterProgressValue = 
            Game_Player.prototype.encounterProgressValue;
    Game_Player.prototype.encounterProgressValue = function(){
        var value = _Game_Player_encounterProgressValue.call(this);
        if(utakata.EncounterControl.isEnabled()){
            value *= utakata.EncounterControl.getProgressValue();
        }
        return value;
    };

    var _Game_Player_updateNonmoving = 
            Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function(wasMoving){
        _Game_Player_updateNonmoving.call(this, wasMoving);
        if(wasMoving && utakata.EncounterControl.isEnabled()){
            utakata.EncounterControl.updateRemainingStepCount();
        }
    };

})();
