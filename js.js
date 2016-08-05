(function () {
	var debug = false;
	var windowSize = {
		width: window.innerWidth,
		height: window.innerHeight
	};
	var imageSize = {
		width: 1096,
		height: 1096
	};
	var minimumRemainSpace = 100;
	var windowSizeRatio = windowSize.width / windowSize.height;
	var imageSizeRatio = imageSize.width / imageSize.height;
	var wrapperWidth, wrapperHeight, translateDistance;
	
	var bodyElement = document.body;
	var roomElement = document.getElementById('room');
	var wrapperElement = document.getElementById('wrapper');
	var roomSideElements = document.querySelectorAll('.js-side');
	var hiddenElement = document.getElementById('hidden');
	var sideConfiguration = {
		front: {
			rotate: null
		},
		left: {
			rotate: {
				y: '90deg'
			}
		},
		back: {
			rotate: {
				y: '180deg'
			}
		},
		right: {
			rotate: {
				y: '-90deg'
			}
		},
		top: {
			rotate: {
				x: '-90deg'
			}
		},
		bottom: {
			rotate: {
				x: '90deg'
			}
		}
	};
	var dragStart = false;
	var lastCursorPoint;
	var wrapperRotate = {
		x: 0,
		y: 0,
		z: 0
	};

	initializeElement();
	registerEvents();

	function initializeElement() {
		initializeWrapperStyle();
		initializeSideStyles();
		initializeRoomPerspective();
	}

	function registerEvents() {
		roomElement.addEventListener('mousedown', function (e) {
			dragStart = true;
			lastCursorPoint = {
				x: e.pageX,
				y: e.pageY
			};

			bodyElement.style.cursor = '-webkit-grabbing';
		}, false);

		document.addEventListener('mousemove', function (e) {
			if (!dragStart || !lastCursorPoint) {
				e.preventDefault();
				return false;
			}

			var deltaX = lastCursorPoint.x - e.pageX;
			var deltaY = e.pageY - lastCursorPoint.y;
			var rotateXDegree = deltaX / 10;
			var rotateYDegree = deltaY / 10;


			wrapperRotate.x += rotateYDegree;
			wrapperRotate.y += rotateXDegree;

			if (debug) {
				console.log(wrapperRotate);
			}

			if (wrapperRotate.x < -90) {
				wrapperRotate.x = -90;
			}
			if (wrapperRotate.x > 90) {
				wrapperRotate.x = 90;
			}
			if (wrapperRotate.y > 360) {
				wrapperRotate.y -= 360;
			}
			if (wrapperRotate.y < -360) {
				wrapperRotate.y += 360;
			}

			wrapperElement.style.transform = createTransformStyle({
				translate: {
					z: translateDistance + 'px'
				},
				rotate: {
					x: wrapperRotate.x + 'deg',
					y: wrapperRotate.y + 'deg'
				}
			});

			lastCursorPoint.x = e.pageX;
			lastCursorPoint.y = e.pageY;
		}, false);

		document.addEventListener('mouseup', function () {
			dragStart = false;
			lastCursorPoint = null;
			bodyElement.style.cursor = '';
		}, false);
	}
	
	function initializeWrapperStyle() {
		if (imageSizeRatio > windowSizeRatio) {
			wrapperWidth = windowSize.width - minimumRemainSpace * 2;
			wrapperHeight = wrapperWidth / imageSizeRatio;
		} else {
			wrapperHeight = windowSize.height - minimumRemainSpace * 2;
			wrapperWidth = wrapperHeight * imageSizeRatio;
		}

		wrapperElement.style.width = wrapperWidth + 'px';
		wrapperElement.style.height = wrapperHeight + 'px';
		translateDistance = wrapperWidth / 2;
		wrapperElement.style.transform = createTransformStyle({
			translate: {
				z: translateDistance + 'px'
			}
		});
	}

	function initializeSideStyles() {
		var roomSideElement, side;
		
		for (var i = 0; i < roomSideElements.length; i++) {
			roomSideElement = roomSideElements[i];
			side = roomSideElement.classList[0];
			
			roomSideElement.style.transform = createTransformStyle({
				rotate: sideConfiguration[side].rotate,
				translate: {
					z: -translateDistance + 'px'
				}
			});
		}
	}

	function initializeRoomPerspective() {
		roomElement.style.perspective = translateDistance + 'px';
	}

	// utility
	function createTransformStyle(transformArguments) {
		var transform = [];
		var props = Object.keys(transformArguments);

		for (var i = 0; i < props.length; i++) {
			transform.push(createTransformProperty(
				props[i],
				transformArguments[props[i]]
			));
		}

		hiddenElement.style.transform = transform.join(' ');
		if (debug) {
			return transform.join(' ');
		} else {
			return getComputedStyle(hiddenElement).getPropertyValue('transform');
		}
	}

	function createTransformProperty(type, axisValue) {
		if (!axisValue)
			return;

		var res = [];

		if (axisValue.x) {
			res.push(type + 'X(' + axisValue.x + ')');
		}
		if (axisValue.y) {
			res.push(type + 'Y(' + axisValue.y + ')');
		}
		if (axisValue.z) {
			res.push(type + 'Z(' + axisValue.z + ')');
		}

		return res.join(' ');
	}
})();
