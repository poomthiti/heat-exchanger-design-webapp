<template>
  <div id="pipeResult">
    <myNav />
    <section class="container" style="height: 72vh">
      <table class="table table-bordered table-striped table-light" style="margin-top: 70px">
        <thead class="thead-light">
          <tr>
            <th scope="col" colspan="2">Results</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Heat Duty</td>
            <td>{{Q}} J/s or Watt</td>
          </tr>
          <tr>
            <td>Hot Media Mass flowrate</td>
            <td> {{hotMassFlowrate}} kg/s</td>
          <tr>
            <td>Cold Utility Usage</td>
            <td>{{coldMassFlowrate}} kg/s</td>
          </tr>
          <tr>
            <td>Overall Heat Transfer Coefficient</td>
            <td>{{Uo}} W /(m²*K)</td>
          </tr>
          <tr>
            <td>Surface Area</td>
            <td>{{area}} m²</td>
          </tr>
          <tr>
            <td>Length</td>
            <td>{{length}} m</td>
          </tr>
          <tr>
            <td>No. of Hairpins Required</td>
            <td>{{hairpinno}}</td>
          </tr>
        </tbody>
      </table>
      <br>
      <router-link to="/">
      <button class="btn btn-success mb-4 px-4 py-3">Restart</button>
      </router-link>
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
    "hotmassflowrate",
    "coldmassflowrate",
    "coldinlettemp",
    "coldoutlettemp",
    "hotflowlocation",
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
      tcAvg: (this.coldinlettemp + this.coldoutlettemp) / 2,
      d1: this.innerdiameter + this.innerthickness,
      de: this.outerdiameter - (this.innerdiameter + this.innerthickness),
      Q: "",
      Uo: "",
      area: "",
      length: "",
      hairpinno: "",
      coldMassFlowrate: this.coldmassflowrate,
      hotMassFlowrate: this.hotmassflowrate,
      prInner: ''
    };
  },
  methods: {
    getFluidProps: async function() {
      const hotFluid = axios
        .get(`https://poom-api.mecode.asia/chemical/${this.hotfluid}`, {
          params: {
            part: "rho,mu,Cp,k",
            t: this.thAvg,
            p: this.pressure
          }
        })
        .catch(() =>
          alert(
            "Can't resolve hot fluid properties at . Make sure you entered appropriate conditions"
          )
        );
      const coldFluid = axios
        .get(`https://poom-api.mecode.asia/chemical/${this.coldfluid}`, {
          params: {
            part: "rho,mu,Cp,k",
            t: this.tcAvg,
            p: this.pressure
          }
        })
        .catch(() =>
          alert(
            "Can't resolve cold fluid properties. Make sure you entered appropriate conditions"
          )
        );

      const [{ data: data1 }, { data: data2 }] = await Promise.all([
        hotFluid,
        coldFluid
      ]);
      (this.hotfluidprops.cp = data1.Cp),
        (this.hotfluidprops.rho = data1.rho),
        (this.hotfluidprops.mu = data1.mu),
        (this.hotfluidprops.k = data1.k),
        (this.coldfluidprops.cp = data2.Cp),
        (this.coldfluidprops.rho = data2.rho),
        (this.coldfluidprops.mu = data2.mu),
        (this.coldfluidprops.k = data2.k);
    },
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

    determineQ() {
      if (this.hotmassflowrate) {
        let Q = (
          this.hotmassflowrate *
          this.hotfluidprops.cp *
          (this.hotinlettemp - this.hotoutlettemp)
        ).toFixed(2);
        return Q;
      } else {
        let Q = (
          this.coldmassflowrate *
          this.coldfluidprops.cp *
          (this.coldoutlettemp - this.coldinlettemp)
        ).toFixed(2);
        return Q;
      }
    },
    determineFlowrate(Q) {
      if (this.hotmassflowrate) {
        let coldmassflowrate = (
          Q /
          (this.coldfluidprops.cp * (this.coldoutlettemp - this.coldinlettemp))
        ).toFixed(2);
        return coldmassflowrate;
      } else {
        let hotmassflowrate = (
          Q /
          (this.hotfluidprops.cp * (this.hotinlettemp - this.hotoutlettemp))
        ).toFixed(2);
        return hotmassflowrate;
      }
    },

    determineHi() {
      let Hi = Number;
      // เพิ่ม this.C and this.hairpinLength *******************************
      if (this.hotflowlocation === "inner") {
        //hot fluid flows in inner pipe
        let reInner =
          (4 * this.hotMassFlowrate) /
          (Math.PI * this.hotfluidprops.mu * this.innerdiameter);
        let prInner =
          (this.hotfluidprops.cp * this.hotfluidprops.mu) /
          this.hotfluidprops.k;
        if (reInner > 10000) {
          Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            0.023 *
            (reInner ** 0.8) *
           (prInner ** (1 / 3));
        } else if (2100 < reInner < 10000) {
          Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            0.116 *
            ((reInner ** (2 / 3)) - 125) *
            (prInner ** (1 / 3)) *
            (1 + ((this.innerdiameter / this.hairpinlength) ** (2 / 3)));
        } else if (reInner < 2100) {
          Hi =
            (this.hotfluidprops.k / this.innerdiameter) *
            1.86 *
            (((reInner * prInner * this.innerdiameter) / this.hairpinlength) **
              (1 / 3));
        }
        return { reInner: reInner, Hi: Hi };
      } else {
        //cold shit in inner pipe
        let reInner =
          (4 * this.coldMassFlowrate) /
          (Math.PI * this.coldfluidprops.mu * this.innerdiameter);
        let prInner =
          (this.coldfluidprops.cp * this.coldfluidprops.mu) /
          this.coldfluidprops.k;
        this.prInner = prInner
        if (reInner > 10000) {
          Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            0.023 *
            (reInner ** 0.8) *
            (prInner **(1 / 3));
        } else if (2100 < reInner < 10000) {
          Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            0.116 *
            ((reInner ** (2 / 3)) - 125) *
            (prInner ** (1 / 3)) *
            (1 + ((this.innerdiameter / this.hairpinlength) ** (2 / 3)));
        } else if (reInner < 2100) {
          Hi =
            (this.coldfluidprops.k / this.innerdiameter) *
            1.86 *
            (((reInner * prInner * this.innerdiameter) / this.hairpinlength) **
              (1 / 3));
        }
        return { reInner: reInner, Hi: Hi };
      }
    },
    determineHo() {
      let Ho = Number;
      if (this.hotflowlocation === "outer") {
        //hot shit in outer pipe
        let reOuter =
          (4 * this.hotMassFlowrate) /
          (Math.PI *
            this.hotfluidprops.mu *
            (this.d1 + this.outerdiameter));
        let prOuter =
          (this.hotfluidprops.cp * this.hotfluidprops.mu) /
          this.hotfluidprops.k;

        if (reOuter > 10000) {
          Ho =
            (this.hotfluidprops.k / this.de) *
            0.023 *
            (reOuter ** 0.8) *
            (prOuter ** 0.4) *
            ((this.outerdiameter / this.d1) ** 0.45);
        } else if (2100 < reOuter < 10000) {
          Ho =
            (this.hotfluidprops.k / this.de) *
            0.116 *
            ((reOuter ** (2 / 3)) - 125) *
            (prOuter ** (1 / 3)) *
            (1 + ((this.de / this.hairpinlength) ** (2 / 3)));
        } else if (reOuter < 2100) {
          Ho =
            (this.hotfluidprops.k / this.de) *
            1.02 *
            (reOuter ** 0.45) *
            (prOuter ** 0.5) *
            ((this.de / this.hairpinlength) ** 0.4) *
            ((this.outerdiameter / this.d1) ** 0.8);
        }
        return { reOuter: reOuter, Ho: Ho };
      } else {
        // cold shit in outer pipe
        let reOuter =
          (4 * this.coldMassFlowrate) /
          (Math.PI *
            this.coldfluidprops.mu *
            (this.d1 + this.outerdiameter));
        let prOuter =
          (this.coldfluidprops.cp * this.coldfluidprops.mu) /
          this.coldfluidprops.k;
        if (reOuter > 10000) {
          Ho =
            (this.coldfluidprops.k / this.de) *
            0.023 *
           (reOuter ** 0.8) *
            (prOuter ** 0.4) *
            ((this.outerdiameter / this.d1)) ** 0.45;
        } else if (2100 < reOuter < 10000) {
          Ho =
            (this.coldfluidprops.k / this.de) *
            0.116 *
            ((reOuter ** (2 / 3)) - 125) *
            (prOuter ** (1 / 3)) *
            (1 + ((this.de / this.hairpinlength) ** (2 / 3)));
        } else if (reOuter < 2100) {
          Ho =
            (this.coldfluidprops.k / this.de) *
            1.02 *
            (reOuter ** 0.45) *
            (prOuter ** 0.5) *
            ((this.de / this.hairpinlength) ** 0.4) *
            ((this.outerdiameter / this.d1) ** 0.8);
        }
        return { reOuter: reOuter, Ho: Ho };
      }
    },
    async getMuAtTwall(tWall) {
      const hotMu = axios
        .get(`https://poom-api.mecode.asia/chemical/${this.hotfluid}`, {
          params: {
            part: "mu",
            t: tWall,
            p: this.pressure
          }
        })
        .catch(() =>
          alert(
            "Can't resolve hot fluid properties at wall temperature. Make sure you entered appropriate conditions"
          )
        );
      const coldMu = axios
        .get(`https://poom-api.mecode.asia/chemical/${this.coldfluid}`, {
          params: {
            part: "mu",
            t: tWall,
            p: this.pressure
          }
        })
        .catch(() =>
          alert(
            "Can't resolve cold fluid properties at wall temperature. Make sure you entered appropriate conditions"
          )
        );

      const [{ data: data1 }, { data: data2 }] = await Promise.all([
        hotMu,
        coldMu
      ])
      this.hotfluidprops.muTwall = data1.mu,
      this.coldfluidprops.muTwall = data2.mu;
    },
    async hiandhoCorrection(Hi, Ho, reOuter) {
      let correctedHo = Number;
      if (this.hotflowlocation === "inner") {
        let tWall = (
          (Hi * this.thAvg + Ho * (this.d1 / this.innerdiameter) * this.tcAvg) /
          (Hi + Ho * (this.d1 / this.innerdiameter))
        ).toFixed();
        
        await this.getMuAtTwall(tWall);
      
        //        await axios //get hot fluid mu at Twall
        //          .get(
        //            "https://cors-anywhere.herokuapp.com/https://poom-api.mecode.asia/chemical/" +
        //              this.hotfluid +
        //              "?part=mu" +
        //              "&t=" +
        //              tWall +
        //              "&p=" +
        //              this.pressure
        //          )
        //          .then(response => (this.hotfluidprops.muTwall = response.data.mu))
        //          .catch(() =>
        //            alert(
        //              "Can't resolve hot fluid properties at wall temperature. Make sure you entered appropriate conditions"
        //            )
        //          );
        let correctedHi =
          Hi * ((this.hotfluidprops.mu / this.hotfluidprops.muTwall) ** 0.14);
        if (reOuter < 10000) {
          correctedHo =
            Ho * ((this.coldfluidprops.mu / this.coldfluidprops.muTwall) ** 0.14);
        } else {
          correctedHo = Ho;
        }
        return { correctedHi: correctedHi, correctedHo: correctedHo };
      } else {
        let tWall = (
          (Hi * this.tcAvg + Ho * (this.d1 / this.innerdiameter) * this.thAvg) /
          (Hi + Ho * (this.d1 / this.innerdiameter))
        ).toFixed();
        await this.getMuAtTwall(tWall);
        let correctedHi =
          Hi * ((this.coldfluidprops.mu / this.coldfluidprops.muTwall)) ** 0.14;
        if (reOuter < 10000) {
          correctedHo =
            Ho * ((this.hotfluidprops.mu / this.hotfluidprops.muTwall)) ** 0.14;
        } else {
          correctedHo = Ho;
        }
        return { correctedHi: correctedHi, correctedHo: correctedHo };
      }
    },
    determineOverallU(correctedHi, correctedHo) {
      let Uo = (
        ((this.d1 / (correctedHi*this.innerdiameter)) +
          ((this.d1 * this.foulingfactor) / this.innerdiameter) +
          ((this.d1 * Math.log(this.d1 / this.innerdiameter)) /
            (2 * this.materialk)) +
          this.foulingfactor +
          (1 / correctedHo)) **
        -1
      ).toFixed(2);
      return Uo;
    },
    determineSize(Q, Uo, lmtd) {
      let area = (Q / (Uo * lmtd)).toFixed(2);
      let length = (area / (2 * Math.PI * this.d1/2)).toFixed(2);
      return { area: area, length: length };
    },
    determineHairpinNo(length) {
      let hairpinNo = Math.ceil(length / this.hairpinlength);
      return hairpinNo;
    },
    async runCalculation() {
      let lmtd = this.calculatelmtd();
      console.log("lmtd = " + lmtd);
      let Q = this.determineQ();
      console.log("Q = " + Q);
      if (this.hotmassflowrate){
        this.coldMassFlowrate = this.determineFlowrate(Q)
      }else (
        this.hotMassFlowrate = this.determineFlowrate(Q)
      );
      console.log('FLOWRATE COMPLETED')
      let Hi = this.determineHi().Hi;
      let reInner = this.determineHi().reInner;
      console.log("Hi = " + Hi + "" + "reInner = " + reInner);
      let detHo = this.determineHo();
      let Ho = detHo.Ho;
      let reOuter = detHo.reOuter;
      console.log("Ho = " + Ho + "" + "reOuter = " + reOuter);
      let hiandhoCorrection = await this.hiandhoCorrection(Hi, Ho, reOuter);
      let correctedHi = hiandhoCorrection.correctedHi;
      let correctedHo = hiandhoCorrection.correctedHo;
      console.log(
        "correction =>  Hi = " + correctedHi + " Ho = " + correctedHo
      );
      let Uo = this.determineOverallU(correctedHi, correctedHo);
      console.log("Uo = " + Uo);
      let detSize = this.determineSize(Q, Uo, lmtd);
      let area = detSize.area;
      let length = detSize.length;
      console.log("Size ==> area = " + area + "  length = " + length);
      let hairpinNo = this.determineHairpinNo(length);
      console.log("hairpinNo = " + hairpinNo);
      //store data in Vue instance
      this.Q = Q;
      this.Uo = Uo;
      this.area = area;
      this.length = length;
      this.hairpinno = hairpinNo;
    }
  },
  async mounted() {
    //const proxyurl = "https://cors-anywhere.herokuapp.com/";
    /*  axios
      .get(`https://poom-api.mecode.asia/chemical/${this.hotfluid}`, {
        params: {
          part: "rho,mu,Cp,k",
          t: this.thAvg,
          p: this.pressure
        }
      })
      .then(response => {
        this.hotfluidprops.cp = response.data.Cp;
        this.hotfluidprops.rho = response.data.rho;
        this.hotfluidprops.mu = response.data.mu;
        this.hotfluidprops.k = response.data.k;
      })
      .catch(() =>
        alert(
          "Can't resolve hot fluid properties. Make sure you entered appropriate conditions"
        )
      );

    axios
      .get(`https://poom-api.mecode.asia/chemical/${this.coldfluid}`, {
        params: {
          part: "rho,mu,Cp,k",
          t: this.tcAvg,
          p: this.pressure
        }
      })
      .then(response => {
        this.coldfluidprops.cp = response.data.Cp;
        this.coldfluidprops.rho = response.data.rho;
        this.coldfluidprops.mu = response.data.mu;
        this.coldfluidprops.k = response.data.k;
      })
      .catch(() =>
        alert(
          "Can't resolve cold fluid properties. Make sure you entered appropriate conditions"
        )
      );
  */
    await this.getFluidProps();
    this.runCalculation();
  }
};
</script>

<style>
</style>