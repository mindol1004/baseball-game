/**
 * @author Hana Lee
 * @since 2016-01-19 19:56
 */
app.v_game_room_menu = (function () {
  'use strict';

  var
    configMap = {
      settable_map : {
        height : null,
        button_width : null
      },
      height : 45,
      button_width : 200
    }, stateMap = {
      container : null
    }, webixMap = {},
    _createView, _showOwnerChangeWindow, _showSettingChangeWindow, _sendGameRoomSettingDataToServer,
    _resetConfigMap, _resetStateMap, _resetWebixMap,
    configModule, initModule;

  _resetConfigMap = function () {
    configMap = {};
    configMap.height = 45;
    configMap.button_width = 200;
  };

  _resetStateMap = function () {
    stateMap.container = null;
    stateMap = {};
  };

  _resetWebixMap = function () {
    webixMap = {};
  };

  _createView = function () {
    var mainView = [{
      id : 'game-room-menu', height : configMap.height,
      on : {
        onDestruct : function () {
          _resetConfigMap();
          _resetStateMap();
          _resetWebixMap();
        }
      },
      cols : [{
        id : 'exit-room', view : 'button', label : '방나가기', type : 'danger', width : configMap.button_width,
        on : {
          onItemClick : function () {
            var gameRoomModel = app.model.getGameRoom();
            if (gameRoomModel.players.length === 1) {
              if (gameRoomModel.players[0].email === app.model.getPlayer().email) {
                app.v_shell.leaveAndGameRoomDelete(gameRoomModel);
              }
            } else {
              app.v_shell.leaveGameRoom(gameRoomModel);
            }
          }
        }
      }, {
        id : 'setting-change', hidden : true, view : 'button', label : '설정', width : configMap.button_width,
        on : {
          onItemClick : function () {
            _showSettingChangeWindow();
          }
        }
      }, {
        id : 'owner-change', hidden : true, view : 'button', label : '방장변경', width : configMap.button_width,
        on : {
          onItemClick : function () {
            _showOwnerChangeWindow();
          }
        }
      }]
    }];

    webixMap.top = webix.ui(mainView, stateMap.container);
    webixMap.main_view = $$('game-room-menu');
    webixMap.setting_change = $$('setting-change');
    webixMap.owner_change = $$('owner-change');
  };

  _showSettingChangeWindow = function () {
    var gameRoom = app.model.getGameRoom();
    webix.ui({
      id : 'setting-change-window',
      view : 'window',
      head : '설정 변경',
      height : 400,
      width : 300,
      position : 'center',
      modal : true,
      body : {
        id : 'setting-change-form',
        view : 'form',
        borderless : true,
        elements : [{
          view : 'text', label : '이름', name : 'name', invalidMessage : '이름을 입력해주세요',
          value : gameRoom.name
        }, {
          view : 'fieldset', label : '게임 설정', name : 'setting',
          body : {
            rows : [{
              view : 'richselect',
              label : '숫자갯수',
              name : 'generationNumberCount',
              invalidMessage : '숫자 갯수를 정해주세요',
              value : gameRoom.setting.generationNumberCount,
              options : [
                {id : 2, value : '2 개'},
                {id : 3, value : '3 개'},
                {id : 4, value : '4 개'},
                {id : 5, value : '5 개'}
              ]
            }, {
              view : 'richselect',
              label : '입력횟수',
              name : 'limitGuessInputCount',
              invalidMessage : '입력 횟수를 정해주세요',
              value : gameRoom.setting.limitGuessInputCount,
              options : [
                {id : 1, value : '1 회'},
                {id : 5, value : '5 회'},
                {id : 10, value : '10 회'},
                {id : 15, value : '15 회'},
                {id : 20, value : '20 회'}
              ]
            }, {
              view : 'richselect',
              label : '입력오류횟수',
              name : 'limitWrongInputCount',
              invalidMessage : '입력 오류 횟수를 정해주세요',
              value : gameRoom.setting.limitWrongInputCount,
              options : [
                {id : 5, value : '5 회'},
                {id : 10, value : '10 회'},
                {id : 15, value : '15 회'},
                {id : 20, value : '20 회'}
              ]
            }]
          }
        }, {
          cols : [{
            view : 'button', value : '저장', type : 'form', hotkey : 'enter',
            click : function () {
              if ($$('setting-change-form').validate()) { //validate form
                _sendGameRoomSettingDataToServer($$('setting-change-form').getValues());
              } else {
                webix.message({type : 'error', text : 'Form data is invalid'});
              }
            }
          }, {
            view : 'button', value : '닫기', type : 'danger', hotkey : 'esc',
            click : function () {
              this.getTopParentView().close();
            }
          }]
        }],
        rules : {
          name : webix.rules.isNotEmpty
        },
        elementsConfig : {
          labelPosition : 'left'
        }
      }
    }).show();

    webixMap.setting_change_window = $$('setting-change-window');
  };

  _sendGameRoomSettingDataToServer = function (data) {
    var sendData, url;

    sendData = {
      name : data.name,
      setting : {
        generationNumberCount : data.generationNumberCount,
        limitGuessInputCount : data.limitGuessInputCount,
        limitWrongInputCount : data.limitWrongInputCount
      }
    };

    sendData = JSON.stringify(sendData);

    url = 'gameroom/' + app.model.getGameRoom().id;

    webix.ajax().headers({
      'Content-Type' : 'application/json'
    }).put(url, sendData, {
      error : function (text) {
        var textJson = JSON.parse(text);
        webix.alert({
          title : '오류',
          ok : '확인',
          text : textJson.message
        });
      },
      success : function (/*text*/) {
        if (webixMap.setting_change_window) {
          webixMap.setting_change_window.close();
        }
      }
    });
  };

  _showOwnerChangeWindow = function () {
    webix.ui({
      id : 'owner-change-window',
      view : 'window',
      modal : true,
      width : 250,
      height : 200,
      position : 'center',
      head : '방장 변경 - 플레이어 리스트',
      body : {
        view : 'layout',
        type : 'space',
        rows : [{
          id : 'player-list',
          view : 'list',
          css : 'player_list',
          select : true,
          template : function (obj) {
            var className = '';
            if (obj.email === app.model.getGameRoom().owner.email) {
              className = 'owner';
            }
            return '<div class="' + className + '" data-id="' + obj.id + '" data-email="' + obj.email + '">닉네임&nbsp;:&nbsp;' + obj.nickname + '</div>';
          },
          data : app.model.getGameRoom().players
        }, {
          cols : [{
            view : 'button', value : '확인', hotkey : 'enter', type : 'form',
            on : {
              onItemClick : function () {
                var selectedPlayer = $$('player-list').getSelectedItem(), data, url,
                  gameRoomModel = app.model.getGameRoom();

                if (selectedPlayer.email === gameRoomModel.owner.email) {
                  webix.alert({
                    title : '오류',
                    ok : '확인',
                    text : '현재 방장은 선택 할 수 없습니다<br/>다른 플레이어를 선택 해 주세요'
                  });
                } else {
                  data = {
                    oldOwnerId : gameRoomModel.owner.id,
                    newOwnerId : selectedPlayer.id
                  };
                  url = 'gameroom/change-owner/' + app.model.getGameRoom().id;
                  webix.ajax().headers({
                    'Content-Type' : 'application/json'
                  }).patch(url, JSON.stringify(data), {
                    error : function (text) {
                      var textJson = JSON.parse(text);
                      webix.alert({
                        title : '오류',
                        ok : '확인',
                        text : textJson.message
                      });
                    },
                    success : function () {
                      $$('owner-change-window').close();
                    }
                  });
                }
              }
            }
          }, {
            view : 'button', value : '닫기', hotkey : 'esc', type : 'danger',
            on : {
              onItemClick : function () {
                $$('owner-change-window').close();
              }
            }
          }]
        }]
      }
    }).show();
  };

  configModule = function (input_map) {
    app.utils.setConfigMap({
      input_map : input_map,
      settable_map : configMap.settable_map,
      config_map : configMap
    });
  };

  initModule = function (container) {
    stateMap.container = container;
    _createView();

    if (app.model.getGameRoom().owner.id === app.model.getPlayer().id) {
      webixMap.owner_change.show();
      webixMap.setting_change.show();
    }
  };

  return {
    initModule : initModule,
    configModule : configModule
  };
}());