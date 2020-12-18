(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["npm.rematrix"],{"6e37":function(r,n,t){"use strict";
/*! @license Rematrix v0.3.0

	Copyright 2018 Julian Lloyd.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
function u(r){if(r.constructor!==Array)throw new TypeError("Expected array.");if(16===r.length)return r;if(6===r.length){var n=e();return n[0]=r[0],n[1]=r[1],n[4]=r[2],n[5]=r[3],n[12]=r[4],n[13]=r[5],n}throw new RangeError("Expected array with either 6 or 16 values.")}function e(){for(var r=[],n=0;n<16;n++)n%5==0?r.push(1):r.push(0);return r}function o(r,n){for(var t=u(r),e=u(n),o=[],a=0;a<4;a++)for(var i=[t[a],t[a+4],t[a+8],t[a+12]],c=0;c<4;c++){var f=4*c,h=[e[f],e[f+1],e[f+2],e[f+3]],s=i[0]*h[0]+i[1]*h[1]+i[2]*h[2]+i[3]*h[3];o[a+f]=s}return o}function a(r){if("string"===typeof r){var n=r.match(/matrix(3d)?\(([^)]+)\)/);if(n){var t=n[2].split(", ").map(parseFloat);return u(t)}}return e()}function i(r){var n=Math.PI/180*r,t=e();return t[5]=t[10]=Math.cos(n),t[6]=t[9]=Math.sin(n),t[9]*=-1,t}function c(r){var n=Math.PI/180*r,t=e();return t[0]=t[10]=Math.cos(n),t[2]=t[8]=Math.sin(n),t[2]*=-1,t}function f(r){var n=Math.PI/180*r,t=e();return t[0]=t[5]=Math.cos(n),t[1]=t[4]=Math.sin(n),t[4]*=-1,t}function h(r,n){var t=e();return t[0]=r,t[5]="number"===typeof n?n:r,t}function s(r){var n=e();return n[12]=r,n}function p(r){var n=e();return n[13]=r,n}t.d(n,"a",(function(){return o})),t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return i})),t.d(n,"d",(function(){return c})),t.d(n,"e",(function(){return f})),t.d(n,"f",(function(){return h})),t.d(n,"g",(function(){return s})),t.d(n,"h",(function(){return p}))}}]);
//# sourceMappingURL=npm.rematrix.c4559f1d.js.map