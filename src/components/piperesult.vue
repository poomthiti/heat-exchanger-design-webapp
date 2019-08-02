<template>
  <div id="pipeResult">
    <myNav />
    <section class="container">
        <table class="table table-bordered table-striped table-light my-5">
          <thead class="thead-light">
            <tr>
              <th scope="col" colspan="2">Results</th>
            </tr>
          </thead>
            <tbody>
              <tr>
                <td>Heat Duty</td>
                <td></td>
              </tr>
              <tr>
                <td>Cold Utility Usage</td>
                <td></td>
              </tr>
              <tr>
                <td>Overall Heat Transfer Coefficient</td>
                <td></td>
              </tr>
              <tr>
                <td>Surface Area</td>
                <td></td>
              </tr>
              <tr>
                <td>Length</td>
                <td></td>
              </tr>
              <tr>
                <td>No. of Hairpins Required</td>
                <td></td>
              </tr>
            </tbody>
        </table>
      
      
  
      <button class="btn btn-primary mb-4" @click="computation()">CHECK RESULT</button>
    </section>
    <customFooter />
  </div>
</template>

<script>
import myNav from "./nav.vue";
import customFooter from "./footer.vue";
import axios from "axios";

export default {
  name: "pipeResult",
  components: {
    myNav,
    customFooter
  },
  props: [
    "flowtype",
    "materialk",
    "innerdiameter",
    "innerthickness",
    "outerdiameter",
    "outerthickness",
    "foulingfactor",
    "hotinlettemp",
    "hotoutlettemp",
    "massflowrate",
    "coldinlettemp",
    "coldoutlettemp",
    "flowlocation",
    "hotfluid",
    "coldfluid",
    "pressure",
    "hairpinlength"
  ],
  data() {
    return {
      hotfluidprops: {},
      coldfluidprops: {},
      thAvg: (this.hotinlettemp + this.hotoutlettemp) / 2,
      tcAvg: (this.coldinlettemp + this.coldoutlettemp) / 2
    };
  },
  computed: {
    computation() {
      let d1 = this.innerdiameter + this.innerthickness;
      let de = this.outerdiameter - d1;

      if (this.flowtype === "co-current") {
        //LMTD
        let lmtd = (
          (this.hotinlettemp -
            this.coldinlettemp -
            (this.hotoutlettemp - this.coldoutlettemp)) /
          Math.log(
            (this.hotinlettemp - this.coldinlettemp) /
              (this.hotoutlettemp - this.coldoutlettemp)
          )
        ).toFixed(2);
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
      }
      //EnergyBalance
      let Q =
        this.massflowrate *
        this.hotfluidprops.cp *
        (this.hotinlettemp - this.hotoutlettemp);
      let coldmassflowrate = (
        Q /
        (this.coldfluidprops.cp * (this.coldoutlettemp - this.coldinlettemp))
      ).toFixed(2);
      // determine Hi
      // เพิ่ม this.C and this.hairpinLength ***************
      if (this.flowlocation === "inner") {
        //hot fluid flows in inner pipe
        let reInner =
          (4 * this.massflowrate) /
          (Math.PI * this.hotfluidprops.mu * this.innerdiameter); //hot shit
        let prInner =
          (this.hotfluidprops.cp * this.hotfluidprops.mu) /
          this.hotfluidprops.k;
        if (reInner > 10000) {
          let Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            0.025 /* C */ *
            reInner ** 0.8 *
            prInner ** (1 / 3);
        } else if (2100 < reInner < 10000) {
          let Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            0.116 *
            (reInner ** (2 / 3) - 125) *
            prInner ** (1 / 3) *
            (1 + (this.innerdiameter / this.hairpinLength) ** (2 / 3));
        } else if (reInner < 2100) {
          let Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            1.86 *
            ((reInner * prInner * this.innerdiameter) / this.hairpinLength) **
              (1 / 3);
        }
        //cold shit in outer pipe
        let reOuter =
          (4 * coldmassflowrate) /
          (Math.PI *
            this.coldfluidprops.mu *
            (this.innerdiameter + this.innerthickness + this.outerdiameter));
        let prOuter =
          (this.coldfluidprops.cp * this.coldfluidprops.mu) /
          this.coldfluidprops.k;
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
            (1 + (de / this.hairpinLength) ** (2 / 3));
        } else if (reOuter < 2100) {
          let Ho =
            (this.coldfluidprops.k / de) *
            1.02 *
            reOuter ** 0.45 *
            prOuter ** 0.5 *
            (de / this.hairpinLength) ** 0.4 *
            (this.outerdiameter / d1) ** 0.8;
        }
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
              "Can't resolve fluid properties. Make sure you entered appropriate conditions"
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
              "Can't resolve fluid properties. Make sure you entered appropriate conditions"
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
            0.025 /* C */ *
            reInner ** 0.8 *
            prInner ** (1 / 3);
        } else if (2100 < reInner < 10000) {
          let Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            0.116 *
            (reInner ** (2 / 3) - 125) *
            prInner ** (1 / 3) *
            (1 + (this.innerdiameter / this.hairpinLength) ** (2 / 3));
        } else if (reInner < 2100) {
          let Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            1.86 *
            ((reInner * prInner * this.innerdiameter) / this.hairpinLength) **
              (1 / 3);
        }
        // hotshit in outer pipe
        let reOuter =
          (4 * this.massflowrate) /
          (Math.PI *
            this.hotfluidprops.k *
            (this.innerdiameter + this.innerthickness + this.outerdiameter));
        let prOuter =
          (this.hotfluidprops.cp * this.hotfluidprops.mu) /
          this.hotfluidprops.k;
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
            (1 + (de / this.hairpinLength) ** (2 / 3));
        } else if (reOuter < 2100) {
          let Ho =
            (this.hotfluidprops.k / de) *
            1.02 *
            reOuter ** 0.45 *
            prOuter ** 0.5 *
            (de / this.hairpinLength) ** 0.4 *
            (this.outerdiameter / d1) ** 0.8;
        }
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
              "Can't resolve fluid properties. Make sure you entered appropriate conditions"
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
              "Can't resolve fluid properties. Make sure you entered appropriate conditions"
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

      let Uo =
        ((d1 / correctedHi) * this.innerdiameter +
          (d1 * this.foulingfactor) / this.innerdiameter +
          (d1 * Math.log(d1 / this.innerdiameter)) / (2 * this.materialk) +
          this.foulingfactor +
          1 / correctedHo) **
        -1;
      let area = (Q / (Uo * lmtd)).toFixed(2);
      let length = (area / (2 * Math.PI * d1)).toFixed(2);
      return lmtd, Q, coldmassflowrate, Uo, area, length
    }
  },
  mounted() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let hoturl =
      "https://poom-api.mecode.asia/chemical/" +
      this.hotfluid +
      "?part=rho,mu,Cp,k" +
      "&t=" +
      this.thAvg +
      "&p=" +
      this.pressure;
    let coldurl =
      "https://poom-api.mecode.asia/chemical/" +
      this.coldfluid +
      "?part=rho,mu,Cp,k" +
      "&t=" +
      this.tcAvg +
      "&p=" +
      this.pressure;
    axios //get hot fluid properties
      .get(proxyurl + hoturl)
      .then(
        response => (
          (this.hotfluidprops.cp = response.data.Cp),
          (this.hotfluidprops.rho = response.data.rho),
          (this.hotfluidprops.mu = response.data.mu),
          (this.hotfluidprops.k = response.data.k)
        )
      )
      .catch(() =>
        alert(
          "Can't resolve hot fluid properties. Make sure you entered appropriate conditions"
        )
      );
    axios //get cold fluid properties
      .get(proxyurl + coldurl)
      .then(
        response => (
          (this.coldfluidprops.cp = response.data.Cp),
          (this.coldfluidprops.rho = response.data.rho),
          (this.coldfluidprops.mu = response.data.mu),
          (this.coldfluidprops.k = response.data.k)
        )
      )
      .catch(() =>
        alert(
          "Can't resolve cold fluid properties. Make sure you entered appropriate conditions"
        )
      );
  }
};
</script>

<style>
</style>