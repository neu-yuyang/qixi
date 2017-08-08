/*
* @Author: the king
* @Date:   2017-08-03 20:56:18
* @Last Modified by:   the king
* @Last Modified time: 2017-08-07 17:36:35
*/

// 动画结束事件
var animationEnd = (function() {
   var explorer = navigator.userAgent;
   if (~explorer.indexOf('WebKit')) {
       return 'webkitAnimationEnd';
   }
   return 'animationend';
})();

//灯动画
var lamp = {
	elem: $('.b_background'),
	bright: function(){
		this.elem.addClass('lamp-bright');
	},
	dark: function(){
		this.elem.removeClass('lamp-bright');
	}
};

// ////////
// //小女孩 //
// ////////
// var girl = {
//     elem: $('.girl'),
//     getHeight: function() {
//         return this.elem.height()
//     },
//     setOffset: function() {
//         this.elem.css({
//             left: visualWidth / 2,
//             top: bridgeY - this.getHeight()
//         });
//     }
// };

// // 修正小女孩位置
// girl.setOffset();

function actionDoor(left,right,time){

	var $door = $('.door');
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right');

	//103~112行不知道什么用，先写着
	var defer = $.Deferred();
	var count = 2;
	//等待开门完成
	var complete = function(){
		if(count == 1){
			defer.resolve();
			return;
		}
		count--;
	};


	doorLeft.animate({
		'left': left},
		time, complete);

	doorRight.animate({
		'left': right},
		time, complete);

	return defer;
}

//开门
function openDoor(){
	return actionDoor('-50%','100%',2000);
}

//关门
function closeDoor(){
	return actionDoor('0','50%',2000);
}


//小男孩走路

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
    function startRun(options, runTime) {
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
        var d1 = startRun({
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
	


	//走进商店
	var instanceX;
	function walkToshop (runtime){
		var defer = $.Deferred();
		var doorObj = $('.door');
		//门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;
		//获取小男孩的坐标
		var offsetBoy = $boy.offset();
		var boyOffsetLeft = offsetBoy.left;
		//需要移动的距离
		instanceX = (doorOffsetLeft+doorObj.width()/2) - (boyOffsetLeft+$boy.width()/2);
		
		//开始走路
		var walkPlay = startRun({
				left: 960+instanceX,

				opacity: 0.1
			},runtime);

		//走路完毕
		walkPlay.done(function(){
			$boy.css({
				opacity:0
			})
			defer.resolve();
		})
		return defer;
	}
	
	// 取花
    function talkFlower() {
        // 增加延时等待效果
        var defer = $.Deferred();
        setTimeout(function() {
            // 取花
            $boy.addClass('slowFlolerWalk');
            defer.resolve();
        }, 1000);
        return defer;
    }


	//走出商店
	function walkOUtShop(runtime){
		var defer = $.Deferred();
		restoreWalk();
		//开始走路
		var walkPlay = startRun({
			transform: 'translateX('+instanceX+'px),scale(1,1)',
			opacity: 1
		},runtime);

		//走路完毕
		walkPlay.done(function(){
			defer.resolve();
		});
		return defer;
	}



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
		},
		toShop: function(){
			return walkToshop.apply(null,arguments);
		},
		outShop: function(){
			return walkOUtShop.apply(null,arguments);
		},
		// 取花
        talkFlower: function() {
            return talkFlower();
        },
        // 获取男孩的宽度
        getWidth: function() {
            return $boy.width();
        },
        // 复位初始状态
        resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
        },
        setFlolerWalk:function(){
             $boy.addClass('slowFlolerWalk');
        },
        // 转身动作
       rotate: function(callback) {
           restoreWalk();
           $boy.addClass('boy-rotate');
           // 监听转身完毕
           if (callback) {
               $boy.on(animationEnd, function() {
                   callback();
                   $(this).off();
               })
           }
       }
	}
}


