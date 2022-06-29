// debugは削除予定
let debug_mode = false;

// 現在のステップ
let current_step = 1;
// 現在のカラーステップ
let current_color_step = 1;
// 一番進んだステップ
let max_progress_step = 1;
// ステップごとのクリアフラグ（必須項目を埋めたか）
let clear_flug_arr_of_step = [false, true, false];
// カラー選択のクリア数
let clear_flug_arr_of_color_step = [false, false, false, false, false, false, false];

// step2（刺繍）の選択項目管理
// 書体、文字色、縁色、
let clear_flug_arr_of_step_2 = [false, false, false];
// 書体
let is_clear_sishu_shotai = false;
// 文字色（チーム名）
let is_clear_sishu_text_color = false;
// 縁色
let is_clear_sishu_text_side_color = false;
// チーム名テキスト
let is_clear_sishu_team_text = false;
// チーム名テキストタイプ
let is_clear_sishu_team_text_type = false;
// 名前テキスト
let is_clear_sishu_name_text = false;
// 名前テキストタイプ
let is_clear_sishu_name_text_type = false;
// 背番号テキスト
let is_clear_sishu_number_text = false;
// 背番号テキストタイプ
let is_clear_sishu_number_text_type = false;
// 文字色（名前）
let is_clear_sishu_name_text_color = false;
// 文字色（番号）
let is_clear_sishu_number_text_color = false;

// 初回アクセスか
let is_first_access_step_2 = true;

const STEP_MAX_COUNT = 3;

$(function() {
    ////////////////////////
    // 初期処理
    ////////////////////////

    display_none_control_panel_without_step(1);

    // 初回モーダル表示
    $('.js-modal').fadeIn();
    $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
    });

    ////////////////////////
    // 検証モード 削除予定
    ////////////////////////
    $("#debug_mode").click(function () {
        if(debug_mode){
            debug_mode = false;
            $("#debug_mode").text("検証モードにする");
            $("#debug_mode").css("color","black");
            $("#debug_mode").css("background-color","");
            $("#debug_mode").css("font-weight","");
        }else{
            debug_mode = true;
            set_active_next_step_button();
            $("#next_step_button").prop("disabled", false);
            $("#debug_mode").text("検証モード中");
            $("#debug_mode").css("color","white");
            $("#debug_mode").css("color","white");
            $("#debug_mode").css("background-color","red");
            $("#debug_mode").css("font-weight","bold");
        }
    });

    ////////////////////////
    // リアルタイム監視
    ////////////////////////
    $(document).ready(function () {
        // !!重要!!
        // チェックボックスをラジオボタンの動きにする
        // ・ラジオボタンの動きに點せたくない場合は、「pure_checkbox」を class名に付与する
        // ・ラジオボタンにするチェックボックスのclass名は、グループを識別できる１つのみを付与する
        $("input:checkbox").click(function(){
            let checkbox_class = $(this).attr("class");
            let checkbox_class_array = checkbox_class.split(" ");

            if ($.inArray('pure_checkbox', checkbox_class_array) == -1) {
                $('.'+checkbox_class).prop("checked",false);
                $(this).prop("checked",true);
            }
        });

        // STEP1
        $(".control-panel-select-item-label-step1").click(function () {
            // labelから選択されたカラーを抽出
            let selected_color = $(this).attr('for').replace(`panel_select_color_${current_color_step}_`,'');

            // current_color_stepを元にclear_flug_arr_of_color_stepを更新（ラジオボタンなので即有効にする）
            clear_flug_arr_of_color_step[current_color_step-1] = true;

            // color- で始まるclassすべて削除
            $(`#parts_selector_${current_color_step}`).removeClass (function (index, css) {
                return (css.match (/\bcolor-\S+/g) || []).join(' ');
            });
            // 選択した色をパーツセレクターの背景にセット
            $(`#parts_selector_${current_color_step}`).addClass('color-'+selected_color);
            $(`#parts_selector_${current_color_step}`).addClass('clear');

            // 新しい選択肢が選択されたら、そのカラーステップ内の選択肢全体を非活性化する
            $(`#control_panel_step_1_${current_color_step}_select_list`).children(".control-panel-select-item-label-step1").css('background-color','#dddddd');
            $(`#control_panel_step_1_${current_color_step}_select_list`).children(".control-panel-select-item-label-step1").css('color','#000');
            // そして、選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // シミュレーターに反映
            set_simulator_by_current_color_step(current_color_step, selected_color);

            // すべてtrueになっていたら
            if ( !clear_flug_arr_of_color_step.includes(false) ) {
                clear_flug_arr_of_step[0] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            }
        });

        // STEP2
        // トグルボタン
        $('#step_2_switch').on('click', function() {
            if ( $(this).prop('checked') == true ) {
                $('#control_panel_step_2_sishu_shotai').show();
                $('#control_panel_step_2_sishu_text_color').show();
                $('#control_panel_step_2_sishu_name_text_color').show();
                $('#control_panel_step_2_sishu_number_text_color').show();
                $('#control_panel_step_2_sishu_text_side_color').show();
                $('#control_panel_step_2_sishu_team_text_type').show();
                $('#control_panel_step_2_sishu_team_text').show();
                $('#control_panel_step_2_sishu_name_text_type').show();
                $('#control_panel_step_2_sishu_name_text').show();
                $('#control_panel_step_2_sishu_number_text_type').show();
                $('#control_panel_step_2_sishu_number_text').show();

                // チーム名
                $(".panel-select-sishu-shotai").prop("disabled", false);
                $(".panel-select-sishu-team-text-type").prop("disabled", false);
                $(".panel-select-sishu-text-color").prop("disabled", false);
                $(".panel-select-sishu-text-side-color").prop("disabled", false);
                // 名前
                $(".panel-select-sishu-name-text-color").prop("disabled", false);
                $(".panel-select-sishu-number-text-color").prop("disabled", false);
                $(".panel-select-sishu-name-text-type").prop("disabled", false);
                $(".panel-select-sishu-number-text-type").prop("disabled", false);

                if (!is_clear_sishu_team_text_type) {
                    // タイプが選択される前（disabled=true）は、text も disabled を true （無効）にする
                    $("#panel_select_sishu_team_text").prop("disabled", true);
                }else{
                    $("#panel_select_sishu_team_text").prop("disabled", false);
                }

                if (!is_clear_sishu_name_text_type) {
                    // タイプが選択される前（disabled=true）は、text も disabled を true （無効）にする
                    $("#panel_select_sishu_name_text").prop("disabled", true);
                }else{
                    $("#panel_select_sishu_name_text").prop("disabled", false);
                }

                if (!is_clear_sishu_number_text_type) {
                    // タイプが選択される前（disabled=true）は、text も disabled を true （無効）にする
                    $("#panel_select_sishu_number_text").prop("disabled", true);
                }else{
                    $("#panel_select_sishu_number_text").prop("disabled", false);
                }

                // 完了している場合は、次へボタン活性化
                if(is_clear_sishu_step())
                {
                    clear_flug_arr_of_step[1] = true;
                    set_active_next_step_button();
                }else{
                    // そうじゃない場合は、次へボタン非活性
                    clear_flug_arr_of_step[1] = false;
                    set_disable_next_step_button();
                }
            } else {
                // 刺繍なしの場合
                clear_flug_arr_of_step[1] = true;
                set_active_next_step_button();

                $('#control_panel_step_2_sishu_shotai').hide();
                $('#control_panel_step_2_sishu_text_color').hide();
                $('#control_panel_step_2_sishu_name_text_color').hide();
                $('#control_panel_step_2_sishu_number_text_color').hide();
                $('#control_panel_step_2_sishu_text_side_color').hide();
                $('#control_panel_step_2_sishu_team_text_type').hide();
                $('#control_panel_step_2_sishu_team_text').hide();
                $('#control_panel_step_2_sishu_name_text_type').hide();
                $('#control_panel_step_2_sishu_name_text').hide();
                $('#control_panel_step_2_sishu_number_text_type').hide();
                $('#control_panel_step_2_sishu_number_text').hide();


                $(".panel-select-sishu-shotai").prop("disabled", true);
                $(".panel-select-sishu-text-color").prop("disabled", true);
                $(".panel-select-sishu-name-text-color").prop("disabled", true);
                $(".panel-select-sishu-number-text-color").prop("disabled", true);
                $(".panel-select-sishu-text-side-color").prop("disabled", true);
                $(".panel-select-sishu-team-text-type").prop("disabled", true);
                $(".panel-select-sishu-name-text-type").prop("disabled", true);
                $(".panel-select-sishu-number-text-type").prop("disabled", true);
                $("#panel_select_sishu_team_text").prop("disabled", true);
                $("#panel_select_sishu_name_text").prop("disabled", true);
                $("#panel_select_sishu_number_text").prop("disabled", true);
            }
        });
        // 刺繍タイプ
        $(".control-panel-select-item-sishu-shotai-label-step2").click(function () {
            is_clear_sishu_shotai = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-shotai-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-shotai-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            }
        });
        // 文字色
        $(".control-panel-select-item-sishu-color-label-step2").click(function () {
            is_clear_sishu_text_color = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-color-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-color-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            }
        });
        // 縁色
        $(".control-panel-select-item-sishu-side-color-label-step2").click(function () {
            is_clear_sishu_text_side_color = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-side-color-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-side-color-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            }
        });
        // チーム名-刺繍タイプ
        $(".control-panel-select-item-sishu-team-text-type-label-step2").click(function () {
            if($(this).attr('for') == 'panel_select_sishu_team_text_type_3'){
                // なしを選択した場合
                is_clear_sishu_team_text_type = false;
                // テキストタイプを無効化
                $(".panel-select-sishu-team-text-type").prop("disabled", true);

                // 合わせてテキストも削除するためテキストのclearフラグもfalseにする
                is_clear_sishu_team_text = false;
                // テキストエリアを無効化
                $("#panel_select_sishu_team_text").prop("disabled", true);
                $("#panel_select_sishu_team_text").val('');
            }else{
                is_clear_sishu_team_text_type = true;
                // テキストエリアを活性化
                $("#panel_select_sishu_team_text").prop("disabled", false);
            }

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-team-text-type-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-team-text-type-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            } else {
                clear_flug_arr_of_step[1] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button();
            }
        });
        // チーム名-テキスト
        $("#panel_select_sishu_team_text").on('input', function () {
            // 文字数が1文字以上の場合のみ、clearフラグをtrueにする
            if ($(this).val().length > 0 ) {
                is_clear_sishu_team_text = true;
            } else {
                is_clear_sishu_team_text = false;
            }

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            } else {
                clear_flug_arr_of_step[1] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button();
            }
        });
        // 名前-刺繍タイプ
        $(".control-panel-select-item-sishu-name-text-type-label-step2").click(function () {
            if($(this).attr('for') == 'panel_select_sishu_name_text_type_4'){
                // なしを選択した場合
                is_clear_sishu_name_text_type = false;
                // テキストタイプを無効化
                $(".panel-select-sishu-name-text-type").prop("disabled", true);

                // 合わせてテキストも削除するためテキストのclearフラグもfalseにする
                is_clear_sishu_name_text = false;
                // テキストエリアを無効化
                $("#panel_select_sishu_name_text").prop("disabled", true);
                $("#panel_select_sishu_name_text").val('');
            }else{
                is_clear_sishu_name_text_type = true;
                // テキストエリアを活性化
                $("#panel_select_sishu_name_text").prop("disabled", false);
            }

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-name-text-type-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-name-text-type-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            } else {
                clear_flug_arr_of_step[1] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button();
            }
        });
        // 文字色（名前）
        $(".control-panel-select-item-sishu-name-color-label-step2").click(function () {
            is_clear_sishu_name_text_color = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-name-color-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-name-color-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            }
        });
        // 名前-テキスト
        $("#panel_select_sishu_name_text").on('input', function () {
            // 文字数が1文字以上の場合のみ、clearフラグをtrueにする
            if ($(this).val().length > 0 ) {
                is_clear_sishu_name_text = true;
            } else {
                is_clear_sishu_name_text = false;
            }

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            } else {
                clear_flug_arr_of_step[1] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button();
            }
        });
        // 番号-刺繍タイプ
        $(".control-panel-select-item-sishu-number-text-type-label-step2").click(function () {
            if($(this).attr('for') == 'panel_select_sishu_number_text_type_3'){
                // なしを選択した場合
                is_clear_sishu_number_text_type = false;
                // テキストタイプを無効化
                $(".panel-select-sishu-number-text-type").prop("disabled", true);

                // 合わせてテキストも削除するためテキストのclearフラグもfalseにする
                is_clear_sishu_number_text = false;
                // テキストエリアを無効化
                $("#panel_select_sishu_number_text").prop("disabled", true);
                $("#panel_select_sishu_number_text").val('');
            }else{
                is_clear_sishu_number_text_type = true;
                // テキストエリアを活性化
                $("#panel_select_sishu_number_text").prop("disabled", false);
            }

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-number-text-type-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-number-text-type-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            } else {
                clear_flug_arr_of_step[1] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button();
            }
        });
        // 文字色（番号）
        $(".control-panel-select-item-sishu-number-color-label-step2").click(function () {
            is_clear_sishu_number_text_color = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-sishu-number-color-label-step2").css('background-color','#dddddd');
            $(".control-panel-select-item-sishu-number-color-label-step2").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            }
        });
        // 番号-テキスト
        $("#panel_select_sishu_number_text").on('input', function () {
            // 数字のみ（空文字NG）
            var reg = new RegExp(/^[0-9]+$/);
            if($(this).val().length > 0 && !reg.test($(this).val())){
                is_clear_sishu_number_text = false;
                $(this).val( $(this).val().slice(0, -1) );
                alert("半角数字のみ入力可能です。");
            }

            // 文字数が1文字以上の場合のみ、clearフラグをtrueにする
            if ($(this).val().length > 0) {
                is_clear_sishu_number_text = true;
            } else {
                is_clear_sishu_number_text = false;
            }

            if ($(this).val().length > 2 ) {
                $(this).val( $(this).val().slice(0, 2) );
            }

            // 完了している場合は、次へボタン活性化
            if(is_clear_sishu_step()){
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button();
            } else {
                clear_flug_arr_of_step[1] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button();
            }
        });
        // STEP3
        // すべての選択肢を押したら完了ボタンを活性化（チェックボックスのため）
        $("#panel_select_agree").click(function () {
            let cnt_checked = $('.panel-select-agree-div input:checkbox:checked').length;

            // 同意事項1つを想定（複数も対応可能な作り）
            if (cnt_checked == 1) {
                clear_flug_arr_of_step[2] = true;
                // 完了ボタン（活性）
                set_active_submit_button();
            } else {
                clear_flug_arr_of_step[2] = false;
                // 完了ボタン（非活性）
                set_disable_submit_button();
            }
        });
    });

    ////////////////////////
    // 前に戻るボタンが押されたら
    ////////////////////////
    $('#back_step_button').on('click', function() {
        // current_step が１より大きい場合のみ実行
        if(current_step > 1){
            // 前のSTEPに現在ステップにする
            $(`#progressbar_step_${current_step}`).removeClass('current');
            $(`#progressbar_step_${current_step-1}`).addClass('current');

            // current_stepを+1する
            current_step-=1;

            // +1されたcurrent_stepに該当する画面を表示
            control_view_by_selected_step(current_step);
        }
    });


    ////////////////////////
    // 次のステップが押されたら
    ////////////////////////

    $('#next_step_button').on('click', function() {

        if(current_step < STEP_MAX_COUNT){
            // 押されたSTEPをactiveにする
            $(`#progressbar_step_${current_step}`).addClass('active');

            // 次のSTEPを現在ステップにする
            $(`#progressbar_step_${current_step}`).removeClass('current');
            $(`#progressbar_step_${current_step+1}`).addClass('current');

            // current_stepを+1する
            current_step+=1;

            // +1されたcurrent_stepに該当する画面を表示
            control_view_by_selected_step(current_step);

            // +1されたcurrent_step が max_progress_step より大きい場合、max_progress_step(一番進んだステップ)を塗り替える
            if(current_step > max_progress_step){
                max_progress_step = current_step;
            }

            $('#next_step_button').attr('type', 'button');
        }else{

            // 完了を押した場合
            if($.inArray(false, clear_flug_arr_of_step) == -1 || debug_mode) {
                // すべてクリアした場合
                // テキストは最終的に完了する直前に、項目名とともにhiddenのvalueを生成して送信する

                ///// チーム名
                if( $('#panel_select_sishu_team_text').val().length > 0 ){
                    $('#panel_select_sishu_team_text_hidden').val( '●【手首ベルト部の刺繍.右手-内容】:'+ $('#panel_select_sishu_team_text').val() );
                }else{
                    $('#panel_select_sishu_team_text_hidden').prop('disabled', true);
                    // チーム名
                    $(".panel-select-sishu-shotai").prop("disabled", true);
                    $(".panel-select-sishu-team-text-type").prop("disabled", true);
                    $(".panel-select-sishu-text-color").prop("disabled", true);
                    $(".panel-select-sishu-text-side-color").prop("disabled", true);
                }

                ///// 名前+(スペース)+番号
                let name = '';

                if( $('#panel_select_sishu_name_text').val().length > 0 ){
                    name += $('#panel_select_sishu_name_text').val();
                }else{
                    // 名前がない場合はオプションも無効にする
                    $(".panel-select-sishu-name-text-type").prop("disabled", true);
                }

                if( $('#panel_select_sishu_number_text').val().length > 0 ){
                    if( name != '' ){
                        name += ' ';
                    }
                    name += $('#panel_select_sishu_number_text').val();
                }else{
                    // 番号がない場合はオプションも無効にする
                    $(".panel-select-sishu-number-text-type").prop("disabled", true);
                    $(".panel-select-sishu-number-text-color").prop("disabled", true);
                }

                if( name != '' ){
                    $('#panel_select_sishu_name_text_hidden').val( '●【あああああああああああ】:'+ name );
                }else{
                    $('#panel_select_sishu_name_text_hidden').prop('disabled', true);
                    $(".panel-select-sishu-name-text-color").prop("disabled", true);
                }

                // buttonをtype=submitにする
                $('#next_step_button').attr('type', 'submit');
            } else {
                alert(`STEP${$.inArray(false, clear_flug_arr_of_step)+1}がまだ完了しておりません。`);
                $('#next_step_button').attr('type', 'button');
            }
        }
    });


    ////////////////////////
    // 各STEPが押されたら
    ////////////////////////

    $('#progressbar').children('li').on('click', function() {
        let selected_step_num = $(this).index()+1;

        // 選択したステップが max_progress_step の範囲内、かつ、current_stepでなければ表示する
        if( selected_step_num <= max_progress_step && selected_step_num != current_step ){
            // alert(`STEP${selected_step_num}を表示します。`);

            // 1. current_stepから現在ステップを削除
            $(`#progressbar_step_${current_step}`).removeClass('current');

            // 2. current_step を 選択された stepに更新
            current_step = selected_step_num;
            control_view_by_selected_step(selected_step_num);

            // 3. 更新されたcurrent_stepを現在ステップにセット
            $(`#progressbar_step_${current_step}`).addClass('current');

        }else if( selected_step_num == current_step ){
            // alert(`STEP${selected_step_num}は既に表示されております。`);

        }else{
            // alert(`まだSTEP${selected_step_num-1}まで完了しておりません。`);
            alert(`先にSTEP${current_step}を完了して下さい。`);
        }
    });


    ////////////////////////
    // カラーSTEPが押されたら
    ////////////////////////
    $(".parts-selector-img").on('click', function() {
        // 選択されたパーツ画像からカラーステップを抽出
        current_color_step = Number( $(this).attr('id').replace('parts_selector_','') );
        // カラーステップに応じてビューを制御
        control_view_color_select(current_color_step);
    });


    ////////////////////////
    // 関数
    ////////////////////////

    /**
     * 選択された step によって、ビューを制御する
     *
     */
    function control_view_by_selected_step(step){

        display_none_control_panel_without_step(step);
        display_none_parts_selector_without_step1(step);

        // debugは削除予定
        if(clear_flug_arr_of_step[step-1] || debug_mode){
            //クリアされたステップだった場合
            // 次のステップボタン（活性化）
            set_active_next_step_button();
        }else{
            // 次のステップボタン（非活性）
            set_disable_next_step_button();
        }

        switch (step) {
            case 1:
                $("#control_panel_header").children('b').text('STEP1. カラー');
                // STEP1のみ前に戻るを押せなくするため
                set_disable_back_step_button();
                break;
            case 2:
                $("#control_panel_header").children('b').text('STEP2. マーク加工');
                set_active_back_step_button();

                // 1. 順序守る必要あり
                if(clear_flug_arr_of_step[step-1]){
                    // クリアされたステップだった場合
                    // 完了ボタン（活性化）
                    set_active_next_step_button();
                }else{
                    // 完了ボタン（非活性）
                    set_disable_next_step_button();
                }

                // 2. 順序守る必要あり
                // デフォルトは設定なしなので、初回アクセス時は、前に進むボタンを有効化
                if(is_first_access_step_2){
                    set_active_next_step_button();
                }
                // 初回アクセスフラグをfalseにする
                is_first_access_step_2 = false;
                break;
            case 3:
                $("#control_panel_header").children('b').text('STEP3. 注意事項');
                set_active_back_step_button();

                if(clear_flug_arr_of_step[step-1]){
                    // クリアされたステップだった場合
                    // 完了ボタン（活性化）
                    set_active_submit_button();
                }else{
                    // 完了ボタン（非活性）
                    set_disable_submit_button();
                }
                break;
            default:
                break;
        }
    }

    /**
     * 該当step以外のcontrol_panelを非表示にする
     *
     */
    function display_none_control_panel_without_step(step){
        for(var i=1; i<=STEP_MAX_COUNT; i++){
            if(step === i){
                $(`#control_panel_step_${i}`).show();
            }else{
                $(`#control_panel_step_${i}`).hide();
            }
        }
    }

    /**
     * current_stepが1（カラー選択）以外の場合、parts_selectorを非表示にする
     *
     */
    function display_none_parts_selector_without_step1(step){
        if(step === 1){
            $("#bag_parts_selector").show();
        }else{
            $("#bag_parts_selector").hide();
        }
    }

    /**
     * 次のステップボタンを活性化
     *
     */
    function set_active_next_step_button(){
        $("#next_step_button").prop("disabled", false);

        $("#next_step_button").text("次に進む");
        $("#next_step_button").css({
            'background-color':'#eb6100',
            'padding-left':'9px',
            'padding-right':'9px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#f56500");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#eb6100");
        });
    }

    /**
     * 前に戻るボタンを活性化
     *
     * @param step ボタンに表示するステップ番号（next step)
     */
    function set_active_back_step_button(){
        $("#back_step_button").prop("disabled", false);

        $("#back_step_button").css({
            'background-color':'#eb6100',
            'padding-left':'9px',
            'padding-right':'9px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#f56500");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#eb6100");
        });
    }
    /**
     * 次のステップボタンを無効化
     *
     */
    function set_disable_next_step_button(){
        // debugは削除予定
        if(!debug_mode){
            $("#next_step_button").prop("disabled", true);

            $("#next_step_button").text("次に進む");
            // $("#next_step_button").text(`STEP${step}に進む`);
            $("#next_step_button").css({
                'background-color':'#d8d8d8',
                'padding-left':'10px',
                'padding-right':'10px',
            });
            $("#next_step_button").hover(function() {
                // カーソルが当たった時の処理
                $(this).css("background-color", "#d8d8d8");
            }, function() {
                // カーソルが離れた時の処理
                $(this).css("background-color", "#d8d8d8");
            });
        }
    }

    /**
     * 前のステップボタンを無効化
     *
     * @param step ボタンに表示するステップ番号（next step)
     */
    function set_disable_back_step_button(){
        $("#back_step_button").prop("disabled", true);

        $("#back_step_button").css({
            'background-color':'#d8d8d8',
            'padding-left':'10px',
            'padding-right':'10px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#d8d8d8");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#d8d8d8");
        });
    }

    /**
     * 完了ボタンを活性化
     *
     */
    function set_active_submit_button(){
        $("#next_step_button").prop("disabled", false);

        // 完了ボタン（活性）
        $("#next_step_button").text('完了');
        $("#next_step_button").css({
            'background-color':'#ca1b1b',
            'padding-left':'20px',
            'padding-right':'20px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#da4343");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#ca1b1b");
        });
    }

    /**
     * 完了ボタンを無効化
     *
     */
    function set_disable_submit_button(){
        $("#next_step_button").prop("disabled", true);

        // 完了ボタン（活性）
        $("#next_step_button").text('完了');
        $("#next_step_button").css({
            'background-color':'#d8d8d8',
            'padding-left':'20px',
            'padding-right':'20px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#d8d8d8");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#d8d8d8");
        });
    }

    /**
     * 選択されたカラーステップに応じて画面を制御
     *
     * @param {*} color_step 表示すべきカラー選択のステップ
     */
    function control_view_color_select(color_step){

        // 該当のカラーステップ以外は非表示
        display_none_color_select_without_color_step(color_step);

        $(".parts-selector-img").removeClass('current');
        $(`#parts_selector_${color_step}`).addClass('current');

        switch (color_step) {
            case 1:
                $("#step_1_title").text('1. 本体1');
                $("#control_panel_explain_span").text('');
                break;
            case 2:
                $("#step_1_title").text('2. 本体2');
                $("#control_panel_explain_span").text('');
                break;
            case 3:
                $("#step_1_title").text('3. 本体3');
                $("#control_panel_explain_span").text('');
                break;
            case 4:
                $("#step_1_title").text('4. 本体4');
                $("#control_panel_explain_span").text('');
                break;
            case 5:
                $("#step_1_title").text('5. パイピング');
                $("#control_panel_explain_span").text('エナメル素材になります。');
                break;
            case 6:
                $("#step_1_title").text('6. 縁巻き');
                $("#control_panel_explain_span").text('');
                break;
            case 7:
                $("#step_1_title").text('7. ファスナー');
                $("#control_panel_explain_span").text('');
                break;
            default:
                $("#control_panel_explain_span").text('');
                break;
        }
    }

    /**
     * 該当カラーステップ以外は非表示にする
     *
     */
    function display_none_color_select_without_color_step(color_step){
        for(var i=1; i<=clear_flug_arr_of_color_step.length; i++){
            if(color_step === i){
                $(`#control_panel_step_1_${i}_select_list`).show();
            }else{
                $(`#control_panel_step_1_${i}_select_list`).hide();
            }
        }
    }

    /**
     * カラーステップと色に合わせて、シミュレーターに反映
     *
     * @param {*} color_step カラーステップ（色を変える箇所）
     * @param {*} selected_color 選択された色
     */
    function set_simulator_by_current_color_step(color_step, selected_color){
        switch (color_step) {
            case 1:
                // バッグの表
                $(`#bag_parts_${color_step}`).removeClass();
                $(`#bag_parts_${color_step}`).addClass('parts-color-'+selected_color);
                // バッグの裏
                $(`#bag_back_parts_${color_step}`).removeClass();
                $(`#bag_back_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 2:
            case 3:
                // 表のみ
                $(`#bag_parts_${color_step}`).removeClass();
                $(`#bag_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 4:
            case 5:
            case 6:
                // バッグの表
                $(`#bag_parts_${color_step}`).removeClass();
                $(`#bag_parts_${color_step}`).addClass('parts-color-'+selected_color);
                // バッグの裏
                $(`#bag_back_parts_${color_step}`).removeClass();
                $(`#bag_back_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 7:
                $(`#bag_parts_${color_step}`).removeClass();
                $(`#bag_parts_${color_step}`).addClass('parts-color-'+selected_color);

                // 8も7に合わせて同じ色にする（ファスナーの金具とサイドの布）
                $(`#bag_parts_${color_step+1}`).removeClass();
                $(`#bag_parts_${color_step+1}`).addClass('parts-color-'+selected_color);
                break;
            default:
                break;
        }
    }

    /**
     * 刺繍ステップが完了したかを判定する
     *
     * チーム名書体 is_clear_sishu_shotai
     * チーム名文字色（チーム名） is_clear_sishu_text_color
     * チーム名縁色 is_clear_sishu_text_side_color
     * チーム名テキスト is_clear_sishu_team_text
     * チーム名テキストタイプ is_clear_sishu_team_text_type
     *
     * or
     *
     * 名前文字色（名前+番号） is_clear_sishu_name_text_color
     * 名前テキスト is_clear_sishu_name_text
     * 名前テキストタイプ is_clear_sishu_name_text_type
     * 背番号テキスト is_clear_sishu_number_text
     * 背番号テキストタイプ is_clear_sishu_number_text_type
     *
     */
    function is_clear_sishu_step(){

        if( !(is_clear_sishu_shotai && is_clear_sishu_text_color && is_clear_sishu_text_side_color && is_clear_sishu_team_text && is_clear_sishu_team_text_type) ){
            if ( !( (is_clear_sishu_name_text && is_clear_sishu_name_text_type && is_clear_sishu_name_text_color) || (is_clear_sishu_number_text && is_clear_sishu_number_text_type && is_clear_sishu_number_text_color) ) ){
                // チーム名 or 名前 に不備がある場合
                return false;
            }
        }
        return true;
    }

});