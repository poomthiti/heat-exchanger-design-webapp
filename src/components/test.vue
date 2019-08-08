<script>
export default {
  name: "test",
  computed: {
    calculatelmtd() {
      if (this.flowtype === "co-current") {
        let lmtd = (
          (this.hotinlettemp -
            this.coldinlettemp -
            (this.hotoutlettemp - this.coldoutlettemp)) /
          Math.log(
            (this.hotinlettemp - this.coldinlettemp) /
              (this.hotoutlettemp - this.coldoutlettemp)
          )
        ).toFixed(2);
        return lmtd;
      } else if (this.flowtype === "counter-current") {
        let lmtd = (
          (this.hotinlettemp -
            this.coldoutlettemp -
            (this.hotoutlettemp - this.coldinlettemp)) /
          Math.log(
            (this.hotinlettemp - this.coldoutlettemp) /
              (this.hotoutlettemp - this.coldinlettemp)
          )
        ).toFixed(2);
        return lmtd;
      }
    },
    energyBalance() {
      let Q =
        this.massflowrate *
        this.hotfluidprops.cp *
        (this.hotinlettemp - this.hotoutlettemp);
      let coldmassflowrate = (
        Q /
        (this.coldfluidprops.cp * (this.coldoutlettemp - this.coldinlettemp))
      ).toFixed(2);
      return Q.toFixed(2), coldmassflowrate;
    },
    determineHi() {
      // เพิ่ม this.C and this.hairpinLength *******************************
      if (this.flowlocation === "inner") {
        //hot fluid flows in inner pipe
        let reInner =
          (4 * this.massflowrate) /
          (Math.PI * this.hotfluidprops.mu * this.innerdiameter);
        let prInner =
          (this.hotfluidprops.cp * this.hotfluidprops.mu) /
          this.hotfluidprops.k;
        if (reInner > 10000) {
          let Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            C *
            reInner ** 0.8 *
            prInner ** (1 / 3);
        } else if (2100 < reInner < 10000) {
          let Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            0.116 *
            (reInner ** (2 / 3) - 125) *
            prInner ** (1 / 3) *
            (1 + (this.innerdiameter / this.hairpinlength) ** (2 / 3));
        } else if (reInner < 2100) {
          let Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            1.86 *
            ((reInner * prInner * this.innerdiameter) / this.hairpinlength) **
              (1 / 3);
        }
      } else {
        //cold shit in inner pipe
        let reInner =
          (4 * coldmassflowrate) /
          (Math.PI * this.coldfluidprops.mu * this.innerdiameter);
        let prInner =
          (this.coldfluidprops.cp * this.coldfluidprops.mu) /
          this.coldfluidprops.k;
        if (reInner > 10000) {
          let Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            C *
            reInner ** 0.8 *
            prInner ** (1 / 3);
        } else if (2100 < reInner < 10000) {
          let Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            0.116 *
            (reInner ** (2 / 3) - 125) *
            prInner ** (1 / 3) *
            (1 + (this.innerdiameter / this.hairpinlength) ** (2 / 3));
        } else if (reInner < 2100) {
          let Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            1.86 *
            ((reInner * prInner * this.innerdiameter) / this.hairpinlength) **
              (1 / 3);
        }
      }
    },
    determineHo() {
      if (this.flowlocation === "outer") {
        //hot shit in outer pipe
        let reOuter =
          (4 * this.massflowrate) /
          (Math.PI *
            this.hotfluidprops.k *
            (this.innerdiameter + this.innerthickness + this.outerdiameter));
        let prOuter =
          (this.hotfluidprops.cp * this.hotfluidprops.mu) /
          this.hotfluidprops.k;
        let d1 = this.innerdiameter + this.innerthickness;
        let de = this.outerdiameter - d1;
        if (reOuter > 10000) {
          let Ho =
            (this.hotfluidprops.k / de) *
            0.023 *
            reOuter ** 0.8 *
            prOuter ** 0.4 *
            (this.outerdiameter / d1) ** 0.45;
        } else if (2100 < reOuter < 10000) {
          let Ho =
            (this.hotfluidprops.k / de) *
            0.116 *
            (reOuter ** (2 / 3) - 125) *
            prOuter ** (1 / 3) *
            (1 + (de / this.hairpinlength) ** (2 / 3));
        } else if (reOuter < 2100) {
          let Ho =
            (this.hotfluidprops.k / de) *
            1.02 *
            reOuter ** 0.45 *
            prOuter ** 0.5 *
            (de / this.hairpinlength) ** 0.4 *
            (this.outerdiameter / d1) ** 0.8;
        }
      } else {
        // cold shit in outer pipe
        let reOuter =
          (4 * coldmassflowrate) /
          (Math.PI *
            this.coldfluidprops.mu *
            (this.innerdiameter + this.innerthickness + this.outerdiameter));
        let prOuter =
          (this.coldfluidprops.cp * this.coldfluidprops.mu) /
          this.coldfluidprops.k;
        let d1 = this.innerdiameter + this.innerthickness;
        let de = this.outerdiameter - d1;
        if (reOuter > 10000) {
          let Ho =
            (this.coldfluidprops.k / de) *
            0.023 *
            reOuter ** 0.8 *
            prOuter ** 0.4 *
            (this.outerdiameter / d1) ** 0.45;
        } else if (2100 < reOuter < 10000) {
          let Ho =
            (this.coldfluidprops.k / de) *
            0.116 *
            (reOuter ** (2 / 3) - 125) *
            prOuter ** (1 / 3) *
            (1 + (de / this.hairpinlength) ** (2 / 3));
        } else if (reOuter < 2100) {
          let Ho =
            (this.coldfluidprops.k / de) *
            1.02 *
            reOuter ** 0.45 *
            prOuter ** 0.5 *
            (de / this.hairpinlength) ** 0.4 *
            (this.outerdiameter / d1) ** 0.8;
        }
      }
    },
    hiandhoCorrection() {
      if (this.flowlocation === "inner") {
        let twall = (
          (Hi * thAvg + Ho * (d1 / this.innerdiameter) * tcAvg) /
          (Hi + Ho * (d1 / this.innerdiameter))
        ).tofixed(0);
        axios //get hot fluid mu at Twall
          .get(
            "https://cors-anywhere.herokuapp.com/https://poom-api.mecode.asia/chemical/" +
              this.hotfluid +
              "?part=mu" +
              "&t=" +
              twall +
              "&p=" +
              this.pressure
          )
          .then(response => (this.hotfluidprops.muTwall = response.data.mu))
          .catch(() =>
            alert(
              "Can't resolve hot fluid properties at wall temperature. Make sure you entered appropriate conditions"
            )
          );
        axios //get cold fluid mu at Twall
          .get(
            "https://cors-anywhere.herokuapp.com/https://poom-api.mecode.asia/chemical/" +
              this.coldfluid +
              "?part=mu" +
              "&t=" +
              twall +
              "&p=" +
              this.pressure
          )
          .then(response => (this.coldfluidprops.muTwall = response.data.mu))
          .catch(() =>
            alert(
              "Can't resolve cold fluid properties at wall temperature. Make sure you entered appropriate conditions"
            )
          );
        let correctedHi =
          Hi * (this.hotfluidprops.mu / this.hotfluidprops.muTwall) ** 0.14;
        if (reOuter < 10000) {
          correctedHo =
            Ho * (this.coldfluidprops.mu / this.coldfluidprops.muTwall) ** 0.14;
        } else {
          correctedHo = Ho;
        }
      } else {
        let twall = (
          (Hi * tcAvg + Ho * (d1 / this.innerdiameter) * thAvg) /
          (Hi + Ho * (d1 / this.innerdiameter))
        ).tofixed(0);
        axios //get hot fluid mu at Twall
          .get(
            "https://cors-anywhere.herokuapp.com/https://poom-api.mecode.asia/chemical/" +
              this.hotfluid +
              "?part=mu" +
              "&t=" +
              twall +
              "&p=" +
              this.pressure
          )
          .then(response => (this.hotfluidprops.muTwall = response.data.mu))
          .catch(() =>
            alert(
              "Can't resolve hot fluid properties at wall temperature. Make sure you entered appropriate conditions"
            )
          );
        axios //get cold fluid mu at Twall
          .get(
            "https://cors-anywhere.herokuapp.com/https://poom-api.mecode.asia/chemical/" +
              this.coldfluid +
              "?part=mu" +
              "&t=" +
              twall +
              "&p=" +
              this.pressure
          )
          .then(response => (this.coldfluidprops.muTwall = response.data.mu))
          .catch(() =>
            alert(
              "Can't resolve cold fluid properties at wall temperature. Make sure you entered appropriate conditions"
            )
          );
        let correctedHi =
          Hi * (this.coldfluidprops.mu / this.coldfluidprops.muTwall) ** 0.14;
        if (reOuter < 10000) {
          correctedHo =
            Ho * (this.hotfluidprops.mu / this.hotfluidprops.muTwall) ** 0.14;
        } else {
          correctedHo = Ho;
        }
      }
      //      let correctedHi = Hi * ((muTavg)/(muTwall))**0.14
      //      let correctedHo = function() {
      //        if (reOuter < 10000) {
      //          Ho = Ho * ((muTavg)/(muTwall))**0.14
      //       }else{
      //         Ho = Ho
      //        }
      //      }
    },
    determineOverallU() {
      let Uo = (
        ((d1 / correctedHi) * this.innerdiameter +
          (d1 * this.foulingfactor) / this.innerdiameter +
          (d1 * Math.log(d1 / this.innerdiameter)) / (2 * this.materialk) +
          this.foulingfactor +
          1 / correctedHo) **
        -1
      ).toFixed(2);
    },
    determineSize() {
      let area = (Q / (Uo * lmtd)).toFixed(2);
      let length = (area / (2 * Math.PI * d1)).toFixed(2);
    },
    determineHairpinsNo() {
        let hairpinsNo = Math.ceil(length / this.hairpinlength)
    }
  }
};
</script>
