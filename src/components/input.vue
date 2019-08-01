<template>
  <div id="searchSpecs">
    <myNav />
    <div class="row row-centered">
      <div class="col-xs-12 col-md-4 d-flex justify-contents-center m-auto">
        <contentPhoto></contentPhoto>
      </div>
      <div class="col-xs-12 col-md-6 d-flex justify-contents-center m-auto">
        <div>
          <h3>Select Heat Transfer Equipment</h3>
          <select class="form-control" v-model="equipment" v-on:change="show()">
            <option value="doublepipe">Double Pipe Heat Exchanger</option>
          </select>
          <br />
          <div id="doublePipeEx" class="d-none">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="card">
                  <div class="card-body">
                    Flow Arrangement :
                    <select class="form-control" v-model="flowType">
                      <option value="co-current">Co-Current Flow</option>
                      <option value="counter-current">Counter-Current Flow</option>
                    </select>
                    Material :
                    <select class="form-control" v-model="materialk">
                      <option value="236">Aluminum</option>
                      <option value="399">Copper</option>
                      <option value="14.4">Stainless Steel Type 304</option>
                      <option value="16.3">Stainless Steel Type 316</option>
                      <option value="14.3">Stainless Steel Type 347</option>
                    </select>
                    <br />
                    <span style="font-size: 21px">Pipe Specifications</span>
                    <br />Inner Pipe :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="innerDiameter"
                      placeholder="Diameter(m)"
                    />
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="innerThickness"
                      placeholder="Thickness(m)"
                    />
                    Outer Pipe :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="outerDiameter"
                      placeholder="Diameter(m)"
                    />
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="outerThickness"
                      placeholder="Thickness(m)"
                    />
                    <br />Fouling Factor :
                    <select class="form-control" v-model="foulingFactor">
                      <option value="0.00009">Alcohol vapors</option>
                      <option value="0.0002">Boiler feed water, treated above 325 K</option>
                      <option value="0.0009">Fuel oil</option>
                      <option value="0.0004">Industrial air</option>
                      <option value="0.0007">Quenching oil</option>
                      <option value="0.0002">Refrigerating liquid</option>
                      <option value="0.00009">Seawater below 325 K</option>
                      <option value="0.0002">Seawater above 325 K</option>
                      <option value="0.00009">Steam</option>
                    </select>
                    <br />
                    Operating Pressure :
                    <input class="form-control" type="number" v-model.number="pressure" placeholder="kPa">
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="card">
                  <div class="card-title pt-3 my-0">
                    <span style="font-size: 21px">Hot Media</span>
                  </div>
                  <div class="card-body" style="background-color: #FFFFFF">
                    Fluid :
                    <select class="form-control text-center" data-live-search="true" data-live-search-style="startsWith" v-model='fluid'>
                      <option value="water">Water</option>
                    </select>
                    Inlet Temperature :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="hotInletTemp"
                      placeholder="°C"
                    />
                    Outlet Temperature :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="hotOutletTemp"
                      placeholder="°C"
                    />
                    Mass Flowrate of Hot media :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="massFlowrate"
                      placeholder="kg/hr"
                    />
                    Flows In :
                    <form>
                      <label class="radio-inline mx-2">
                        <input
                          type="radio"
                          name="flowLocation"
                          value="inner"
                          v-model="flowLocation"
                          checked
                        />Inner Pipe
                      </label>
                      <label class="radio-inline mx-2">
                        <input
                          type="radio"
                          name="flowLocation"
                          value="outer"
                          v-model="flowLocation"
                        />Outer Pipe
                      </label>
                    </form>
                  </div>
                </div>
                <br />
                <div class="card">
                  <div class="card-title pt-3 my-0">
                    <span style="font-size: 21px">Cold Media</span>
                  </div>
                  <div class="card-body">
                    Inlet Temperature :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="coldInletTemp"
                      placeholder="°C"
                    />
                    Outlet Temperature :
                    <input
                      class="form-control"
                      type="number"
                      v-model.number="coldOutletTemp"
                      placeholder="°C"
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />
            <button @click="passData" class="btn btn-success">Search !</button>
            <br />
            <br />
          </div>

          <div id="shellTubeEx" class="d-none">
            <div class="row">
              <div class="col-12 col-md-6">
                Flow Arrangement :
                <select class="form-control" v-model="flowType">
                  <option value="co-current">Co-Current Flow</option>
                  <option value="counter-current">Counter-Current Flow</option>
                </select>
                Exchanger Type :
                <select
                  class="form-control"
                  v-model="exchangerType"
                >
                  <option value="fixedtube">Fixed Tube Sheet</option>
                  <option value="u-tube">U-Tube</option>
                  <option value="floating-head">Floating Head</option>
                </select>
                Material :
                <select class="form-control" v-model="materialk">
                  <option value="aluminum">Aluminum</option>
                  <option value="copper">Copper</option>
                  <option value="stainless-steel">Stainless Steel Type 304</option>
                  <option value="stainless-steel">Stainless Steel Type 316</option>
                  <option value="stainless-steel">Stainless Steel Type 347</option>
                </select>
                <br />
                <span style="font-size: 21px">TEMA Designations</span>
                <br />Stationary Head :
                <select class="form-control" v-model="stationaryHeadType">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="N">N</option>
                  <option value="D">D</option>
                </select>
                Shell Types :
                <select class="form-control" v-model="shellType">
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                  <option value="J">J</option>
                  <option value="K">K</option>
                  <option value="X">X</option>
                </select>
                Rear Head Types :
                <select
                  class="form-control"
                  v-model="rearHeadType"
                >
                  <option value="L">L</option>
                  <option value="M">M</option>
                  <option value="N">N</option>
                  <option value="P">P</option>
                  <option value="S">S</option>
                  <option value="T">T</option>
                  <option value="U">U</option>
                  <option value="W">W</option>
                </select>
                <br />
                <span style="font-size: 21px">Tube Specifications</span>
                <br />Material :
                <select class="form-control" v-model="tubeMaterial">
                  <option value="aluminum">Aluminum</option>
                  <option value="copper">Copper</option>
                  <option value="stainless-steel">Stainless Steel</option>
                </select>
                Outer Diameter :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="outerDiameter"
                  placeholder="Diameter(m)"
                />
                Length :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="tubeLength"
                  placeholder="Length(m)"
                />
                Tube passes :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="passes"
                  placeholder="no. of passes"
                />
                <br />
              </div>
              <div class="col-12 col-md-6">
                <span style="font-size: 21px">Hot Media</span>
                <br />Inlet Temperature :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="hotInletTemp"
                  placeholder="°C"
                />
                Outlet Temperature :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="hotOutletTemp"
                  placeholder="°C"
                />
                Mass Flowrate of Hot media :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="massFlowrate"
                  placeholder="kg/hr"
                />
                <br />
                <span style="font-size: 21px">Cold Media</span>
                <br />Inlet Temperature :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="coldInletTemp"
                  placeholder="°C"
                />
                Outlet Temperature :
                <input
                  class="form-control"
                  type="number"
                  v-model.number="coldOutletTemp"
                  placeholder="°C"
                />
                <br />Fouling Factor :
                <select class="form-control" v-model="foulingFactor">
                  <option value="0.00009">Alcohol vapors</option>
                  <option value="0.0002">Boiler feed water, treated above 325 K</option>
                  <option value="0.0009">Fuel oil</option>
                  <option value="0.0004">Industrial air</option>
                  <option value="0.0007">Quenching oil</option>
                  <option value="0.0002">Refrigerating liquid</option>
                  <option value="0.00009">Seawater below 325 K</option>
                  <option value="0.0002">Seawater above 325 K</option>
                  <option value="0.00009">Steam</option>
                </select>
              </div>
            </div>
            <br />
            <button class="btn btn-success">Search !</button>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
    <customFooter />
  </div>
</template>

<script>
import myNav from "./nav.vue";
import customFooter from "./footer.vue";
import contentPhoto from "./content-photo.vue";
import doublePipeImg from "../assets/blepipe.png";
import shellImg from "../assets/shell.png";

export default {
  name: "searchSpecs",
  data() {
    return {
      equipment: "",
      flowType: "",
      materialk: "",
      hotInletTemp: "",
      hotOutletTemp: "",
      coldInletTemp: "",
      coldOutletTemp: "",
      innerDiameter: "",
      innerThickness: "",
      outerDiameter: "",
      outerThickness: "",
      massFlowrate: "",
      exchangerType: "",
      stationaryHeadType: "",
      shellType: "",
      rearHeadType: "",
      tubeMaterial: "",
      tubeLength: "",
      passes: "",
      foulingFactor: "",
      flowLocation: "",
      fluid: "",
      pressure: "",
    };
  },
  components: {
    contentPhoto,
    myNav,
    customFooter
  },
  methods: {
    show() {
      if (this.equipment === "doublepipe") {
        document.getElementById("doublePipeEx").classList.remove("d-none"),
          document.getElementById("shellTubeEx").classList.add("d-none"),
          (document.getElementById("shufflingImage").src = doublePipeImg);
      } else if (this.equipment === "shellandtube") {
        document.getElementById("doublePipeEx").classList.add("d-none"),
          document.getElementById("shellTubeEx").classList.remove("d-none"),
          (document.getElementById("shufflingImage").src = shellImg);
      }
    },
    passData() {
      this.$router.push({
        name: "pipeResult",
        params: {
          flowtype: this.flowType,
          materialk: this.materialK,
          innerdiameter: this.innerDiameter,
          innerthickness: this.innerThickness,
          outerdiameter: this.outerDiameter,
          outerthickness: this.outerThickness,
          foulingfactor: this.foulingFactor,
          hotinlettemp: this.hotInletTemp,
          hotoutlettemp: this.hotOutletTemp,
          massflowrate: this.massFlowrate,
          coldinlettemp: this.coldInletTemp,
          coldoutlettemp: this.coldOutletTemp,
          flowlocation: this.flowLocation,
          fluid: this.fluid,
          pressure: this.pressure*1000
        }
      });
    }
  }
};
</script>

<style>
h3 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(185, 48, 78);
  margin-top: 15px;
}
</style>