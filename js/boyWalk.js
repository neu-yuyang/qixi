/*
* @Author: the king
* @Date:   2017-08-04 14:42:02
* @Last Modified by:   the king
* @Last Modified time: 2017-08-04 16:27:38
*/

function BoyWalk(){
	var container = $('#content');
	var visualWidth = container.width();
	var visualHeight = container.height();
				
	//定义一个获取数据的函数
	var getValue = function(className){
		//通过类名获取到节点
		var $elem = $(''+className+'');
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	};
	//获取路的Y坐标
	var pathY = function(){
		var data = getValue('.a_background_middle');
		return data.top + data.height/2;
	}();
	//获取男孩的高度
	var $boy = $('#boy');
	var boyWidth = $boy.width();
	var boyHeight = $boy.height();
	//修改男孩的位置
	$boy.css({
		top: pathY-boyHeight+25
	});


	////////////////////////////////////////////////
	//=================动画处理=====================
	////////////////////////////////////////////////

	// 恢复走路
	function restoreWalk(){
		$boy.removeClass('pauseWalk');
	}

	//暂停走路
	function pauseWalk(){
		$boy.addClass('pauseWalk');
	}

	//原地走路
	function slowWalk(){
		$boy.addClass('slowWalk');
	}

	//计算需要移动的距离
	function calculateDist(direction,proportiion){
		var dist = (direction == 'x' ? visualWidth : visualHeight)*proportiion;
		return dist;
	}

	// 用transition做运动
    function stratRun(options, runTime) {
        var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性
        $boy.animate(
        	options,
        	runTime, function() {
        	/* stuff to do after animation is complete */
        	dfdPlay.resolve(); // 动画完成
        });
        // $boy.fn.transition(
        //     options,
        //     runTime,
        //     'linear',
        //     function() {
        //         dfdPlay.resolve(); // 动画完成
        //     });
        return dfdPlay;
    }

    // 开始走路
    function walkRun(time, dist, disY) {
        time = time || 3000;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = stratRun({
            'left': dist + 'px',
            'top': disY ? disY : undefined
        }, time);
        return d1;
    }
	// //用css实现运动
	// function startRun(l,t,runtime){
	// 	var dfdPlay = $.Deferred();
	// 	//恢复走路
	// 	restoreWalk();
		
	// 	$boy.css({
	// 		left: l+'px',
	// 		top: t+'px',
	// 		transition: 'left '+runtime+'ms linear,top '+runtime+'ms linear',
	// 		function(){
	// 			dfdPlay.resolve();
	// 		}
	// 	});
	// 	return dfdPlay;
	// }

	// //开始走路
	// function walkRun(time,disX,disY){
	// 	time = time || 3000;
	// 	//脚步动作
	// 	slowWalk();
	// 	//开始走路
	// 	var dl = startRun(disX,disY,time);
	// 	return dl;
	// }

	//提供的接口
	return {
		//开始走路
		walkTo: function(time, proportionX, proportionY){
			var distX = calculateDist('x',proportionX);
			var distY = calculateDist('y',proportionY);
			return walkRun(time,distX,distY);
		},
		stopWalk: function(){
			return pauseWalk();
		},
		setColor: function(value){
			$boy.css('background-color',value);
		}
	}
}