var mySlider = (function () {
    function Slider(slider) {
        this.slider = slider;
        this.stator = slider.querySelector(".stator");
        this.rotor = slider.querySelector(".rotor");
        this.leftArrow = slider.querySelector(".arrow-left");
        this.rightArrow = slider.querySelector(".arrow-right");
        this.pointers = slider.querySelector(".pointers");
        this.hTimer = null;
        this.pause = false;

        this.mousedown=false;  //отпущена ли кнопка
        this.endActionSwipe=false;
        this.coords=[];

        this.slideCount = this.rotor.children.length;
        this.createPointer();
        this.setActive(this.active = 0);

        this.leftArrow.addEventListener("click", function(){this.animateRight();}.bind(this));
        this.rightArrow.addEventListener("click", function(){this.animateLeft();}.bind(this));
        this.slider.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.slider.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        /*this.pointers.addEventListener("click", function (e) {
            if(e.target.matches("span"))this.toSlide(e.target.dataset.slide);
        }.bind(this)); */ //Для реализации переключения слайдер по клину на область pointers(поле ползунка внизу)

        this.slider.addEventListener("mousedown",function (e) {
            this.coords.x = e.clientX;
            this.coords.y = e.clientY;
            this.mousedown = true;
        }.bind(this));

        this.slider.addEventListener("mouseup",function (e) {
            this.mousedown = false;
            this.endActionSwipe = false;
        }.bind(this));

        this.slider.addEventListener("mousemove",function (e) {
            if(!this.mousedown || this.endActionSwipe || Math.abs(this.coords.y - e.clientY)>Math.abs(this.coords.y - e.clientY)) return;
            if(this.coords.x - e.clientX>20) this.animateLeft();
            else if(this.coords.x - e.clientX<-20) this.animateRight();
            else return;
                this.endActionSwipe = true;
        }.bind(this));

        setInterval(this.autoList.bind(this), 5000);
    }

    Slider.DEFAULD_SPEED = 4;
    Slider.BOOST_SPEED = 20;

    Slider.prototype.animateRight = function (nitro, onend) {
        if(this.hTimer != null) return;
        this.rotor.insertBefore(this.rotor.lastElementChild, this.rotor.firstElementChild);
        var mleft = -100;
        this.rotor.style.marginLeft = mleft + "%";
        this.setActive(this.active>0?this.active-1:this.slideCount-1);
        this.hTimer = setInterval(function () {
            mleft += nitro?Slider.BOOST_SPEED:Slider.DEFAULD_SPEED;
            this.rotor.style.marginLeft = mleft + "%";
            if(mleft >= 0){
                clearInterval(this.hTimer);
                this.hTimer = null;
                this.rotor.style.marginLeft='';
                if(onend) onend();
            }
        }.bind(this), 40)
    };


    Slider.prototype.animateLeft = function (nitro, onend) {
        if(this.hTimer != null) return;
        var mleft = 0;
        this.setActive(this.active<this.slideCount-1?this.active+1:0);
        this.hTimer = setInterval(function () {
            mleft -= nitro?Slider.BOOST_SPEED:Slider.DEFAULD_SPEED;
            this.rotor.style.marginLeft = mleft + "%";
            if(mleft <= -100){
                clearInterval(this.hTimer);
                this.hTimer = null;
                this.rotor.appendChild(this.rotor.firstElementChild);
                this.rotor.style.marginLeft='';
                if(onend) onend();

            }
        }.bind(this), 40)
    };

    Slider.prototype.autoList = function () {
        if(!this.pause) this.animateLeft();
    };

    Slider.prototype.onMouseEnter = function () {
         this.pause = true;
    };

    Slider.prototype.onMouseLeave = function () {
        this.pause = false;
    };

    Slider.prototype.createPointer = function () {
       this.x = document.createElement("SPAN");
       this.x.className="move_block";
       this.x.dataset.active = 0;

       this.pointerWidth = 100/this.slideCount;
       this.x.style.width = this.pointerWidth + "%";
       this.pointers.appendChild(this.x);

    };

    Slider.prototype.setActive = function (num) {
        var positionLeft = (num/this.slideCount)*100;
        this.x.style.left = positionLeft + "%";
        this.active = num;

    };

    Slider.prototype.toSlide = function (num) {
        if(this.active>num) this.animateRight(true, function () {
            this.toSlide(num);
        }.bind(this));
        if(this.active<num) this.animateLeft(true, function () {
            this.toSlide(num);
        }.bind(this));
    };

    return Slider;
})();






window.addEventListener("load", function () {
    var s = document.querySelector(".slider");
    new mySlider(s);
});