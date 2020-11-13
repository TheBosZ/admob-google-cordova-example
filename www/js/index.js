/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	if (typeof admob === 'undefined') {
		throw new Error('Admob plugin not installed correctly');
	}
	var btn_initialize_rewarded = document.getElementById('btn_initial_rewarded');
	var btn_show_rewarded = document.getElementById('btn_rewarded');

	var btn_initialize_interstitial = document.getElementById('btn_initial_interstitial');
	var btn_show_interstitial = document.getElementById('btn_show_interstitial');

	var btn_initialize_banner = document.getElementById('btn_initial_banner');
	var btn_show_banner = document.getElementById('btn_show_banner');

	admob.setOptions({
		interstitialAdId: 'ca-app-pub-3940256099942544/1033173712', //Google's test id
		rewardedAdId: 'ca-app-pub-3940256099942544/5224354917', //Google's test id
		bannerAdId: 'ca-app-pub-3940256099942544/6300978111', //Google's test id
		appOpenAdId: 'ca-app-pub-3940256099942544/3419835294', //Google's test id
		autoShowInterstitial: false,
		autoShowBanner: false,
	});

	btn_initialize_rewarded.addEventListener('click', function () {
		admob.requestRewardedAd();
	}, false);

	btn_show_rewarded.addEventListener('click', function () {
		admob.showRewardedAd();
	}, false);

	btn_initialize_interstitial.addEventListener('click', function () {
		admob.requestInterstitialAd();
	}, false);

	btn_show_interstitial.addEventListener('click', function () {
		admob.showInterstitialAd();
	}, false);

	btn_initialize_banner.addEventListener('click', function () {
		admob.createBannerView();
	}, false);

	btn_show_banner.addEventListener('click', function () {
		admob.showBannerAd();
	}, false);

	btn_load_app_open.addEventListener('click', function () {
		admob.requestAppOpenAd();
	}, false);

	window.addEventListener(admob.events.onAdLoaded, handleEvent, true);
	window.addEventListener(admob.events.onAdClosed, handleEvent, true);

	var handlers = {};
	var adLoaded = {};

	adLoaded[admob.AD_TYPE.INTERSTITIAL] = enableInterstitial;
	adLoaded[admob.AD_TYPE.REWARDED] = enableRewarded;
	adLoaded[admob.AD_TYPE.BANNER] = enableBanner;

	handlers[admob.events.onAdLoaded] = adLoaded;

	var adClosed = {};
	adClosed[admob.AD_TYPE.INTERSTITIAL] = disableInterstitial;
	adClosed[admob.AD_TYPE.REWARDED] = disableRewarded;
	adClosed[admob.AD_TYPE.BANNER] = disableBanner;

	handlers[admob.events.onAdClosed] = adClosed;

	function handleEvent(event) {
		console.info('got an event', event);
		if (typeof handlers[event.type] !== 'undefined' && typeof handlers[event.type][event.adType] === 'function') {
			console.info('handling event');
			handlers[event.type][event.adType](event);
		} else {
			console.info(
				'no handler for event. Event type has entry: ' + (typeof handlers[event.type] !== 'undefined') + ', ad type has entry: ' + (typeof handlers[event.type][event.adType] === 'function')
			);
		}
	}

	function enableInterstitial() {
		btn_show_interstitial.disabled = false;
	};

	function disableInterstitial() {
		btn_show_interstitial.disabled = true;
	}

	function enableRewarded() {
		btn_show_rewarded.disabled = false;
	}

	function disableRewarded(event) {
		if (typeof event.rewardAmount !== 'undefined' && typeof event.rewardType !== 'undefined') {
			alert("Video rewarded: You have been rewarded " + (event.rewardAmount) + " " + (event.rewardType));
		}
		btn_show_rewarded.disabled = true;
	}

	function enableBanner() {
		btn_show_banner.disabled = false;
	}

	function disableBanner() {
		btn_show_banner.disabled = true;
	}

}
