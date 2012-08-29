<h2>Code Generator:</h2>
<div id="tool">
Okay, so I've called my <a href="http://developer.android.com/reference/android/app/AlarmManager.html">AlarmManager</a> <code>alm</code>.<br/>
I want an alarm which:<br/>
<input type="radio" checked id="repeat" name="repeat"/><label for="repeat">Repeats exactly</label><br/>
<input type="radio" id="repeat_in" name="repeat"/><label for="repeat_in">Repeats inexactly <span class="label success" title="Use this if you need to repeat operations and it is not absolutely crucial for those to run on time (for example, weather)">Good for battery life!</span></label><br/>
<input type="radio" id="once" name="repeat"/><label for="once">Exactly on time</label><br/>
And I want it to run first of all in <input placeholder="none" style="width:50px" id="hours"/> hours, <input id="mins" style="width:50px" placeholder="none"/> minuites and <input id="secs" value="5" placeholder="none" style="width:50px"/> seconds.<br/>
<div id="repeatopts">
It needs to repeat every (if you need a custom, just replace the final result with your interval in microseconds (seconds * 1000) ):<br/>
<input type="radio" checked id="in_hour" name="in"/><label for="in_hour">hour</label><br/>
<input type="radio" id="in_hhour" name="in"/><label for="in_hhour">half hour</label><br/>
<input type="radio" id="in_15" name="in"/><label for="in_15">15 mins</label><br/>
<input type="radio" id="in_day" name="in"/><label for="in_day">day</label><br/>
<input type="radio" id="in_hday" name="in"/><label for="in_hday">half a day</label><br/>
</div>
And the code is going to be roughly (updating whenever you do):
<pre id="thecode">
// Please set something
</pre>
</div>
</div>
