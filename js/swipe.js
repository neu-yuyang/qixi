/*
* @Author: the king
* @Date:   2017-08-03 22:12:47
* @Last Modified by:   the king
* @Last Modified time: 2017-08-07 16:44:24
*/

'use strict';
/*
将页面滑动封装函数
 */
function Swipe(container){
	var swipe = {};
	//获取第一个子节点
	var element = container.find(':first');
	//获取li的列表集
	var lis = element.find('>');
	//获取容器的尺寸
	var width = container.width();
	var height = container.height();

	//设置父容器的总宽度
	element.css({
		width: (lis.length*width)+'px',
		height: height+'px'
	});
	//设置每一个页面的尺寸
	$.each(lis,function(index){
		var li = lis.eq(index);
		li.css({
			width: width+'px',
			height: height+'px'
		});
	});
	//让父容器动起来
	swipe.scrollTo = function (x,time){
		element.css({
			'transition-duration': time+'ms',
			'transition-timing-function':'linear',
			'transform':'translateX(-'+x+'px)'
		});
	}
	
	return swipe;
};
