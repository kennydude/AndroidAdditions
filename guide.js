// Thanks http://www.yelotofu.com/2008/08/jquery-outerhtml/
jQuery.fn.outerHTML = function(s) {
	return (s)
		? this.before(s).remove()
		: jQuery("<p>").append(this.eq(0).clone()).html();
}

/*!
  * jquery.toc.js - A jQuery plugin that will automatically generate a table of contents. 
  * v0.0.3
  * https://github.com/jgallen23/toc
  * copyright JGA 2012
  * MIT License
  */
!function(e){e.fn.toc=function(t){var n=this,r=e.extend({},jQuery.fn.toc.defaults,t),i=e(r.container),s=e(r.selectors,i),o=[],u=r.prefix+"-active",a=function(t){for(var n=0,r=arguments.length;n<r;n++){var i=arguments[n],s=e(i);if(s.scrollTop()>0)return s;s.scrollTop(1);var o=s.scrollTop()>0;s.scrollTop(0);if(o)return s}return[]},f=a(r.container,"body","html"),l=function(t){if(r.smoothScrolling){t.preventDefault();var i=e(t.target).attr("href"),s=e(i);f.animate({scrollTop:s.offset().top},400,"swing",function(){location.hash=i})}e("li",n).removeClass(u),e(t.target).parent().addClass(u)},c,h=function(t){c&&clearTimeout(c),c=setTimeout(function(){var t=e(window).scrollTop(),i;for(var s=0,a=o.length;s<a;s++)if(o[s]>=t){e("li",n).removeClass(u),i=e("li:eq("+(s-1)+")",n).addClass(u),r.onHighlight(i);break}},50)};return r.highlightOnScroll&&(e(window).bind("scroll",h),h()),this.each(function(){var t=e(this),n=e("<ul/>");s.each(function(i,s){var u=e(s);o.push(u.offset().top-r.highlightOffset);var a=e("<span/>").attr("id",r.anchorName(i,s,r.prefix)).insertBefore(u),f=e("<a/>").text(u.text()).attr("href","#"+r.anchorName(i,s,r.prefix)).bind("click",function(n){l(n),t.trigger("selected",e(this).attr("href"))}),c=e("<li/>").addClass(r.prefix+"-"+u[0].tagName.toLowerCase()).append(f);n.append(c)}),t.html(n)})},jQuery.fn.toc.defaults={container:"body",selectors:"h1,h2,h3",smoothScrolling:!0,prefix:"toc",onHighlighted:function(){},highlightOnScroll:!0,highlightOffset:100,anchorName:function(e,t,n){return n+e}}}(jQuery)

$(document).ready(function(){
	$.get(document.location.hash.substr(1), function(data){
		$("#body").html(data);

		$("h3:contains('READMORE')").each(function(){
			if($(this).text() != "READMORE") return;
			var content = '';
			var s = $(this).next();
			while(s.text() != "ENDREADMORE"){
				console.log(content);
				content = content + s.outerHTML();
				n = s.next();
				s.remove();
				s = n;
			}
			s.remove();
			
			rmore = $("<div>").html("<a href='#' class='openmore'>Read More</a><div class='readmore hide'></div>");
			$(".readmore", rmore).html(content); console.log(content);
			$("a.openmore", rmore).click(function(){
				$(".readmore", $(this).parent()).toggleClass("hide");
				return false;
			});
			$(this).replaceWith(rmore);
		});
		
		$('#toc').toc();
	});
});
