<template>
  <div id="searchSpecs">
    <div class="row">
      <div class="col-12 col-md-6 d-flex justify-contents-center m-auto">
        <contentPhoto  v-bind:equipment="equipment"></contentPhoto>
      </div>
      <div class="col-12 col-md-6 d-flex justify-contents-center m-auto">
        <div>
          <h3>Select Heat Transfer Equipment</h3>
          <select class="form-control" v-model="equipment" v-on:change="show()">
            <option value="doublepipe">Double Pipe Heat Exchanger</option>
            <option value="shellandtube">Shell and Tube Heat Exchanger</option>
          </select>
          <br />
          <div id="doublePipeEx" class="d-none">
            <div class="row">
              <div class="col-12 col-md-6">
                Flow Arrangement :
                <select class="form-control" v-model="flowType">
                  <option value="co-current">Co-Current Flow</option>
                  <option value="counter-current">Counter-Current Flow</option>
                </select>
                Material :
                <select class="form-control" v-model="material">
                  <option value="aluminum">Aluminum</option>
                  <option value="copper">Copper</option>
                  <option value="stainless-steel">Stainless Steel</option>
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
                <br />
              </div>
            </div>
            <button class="btn btn-success">Search !</button>
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
                <select class="form-control" v-model="material">
                  <option value="aluminum">Aluminum</option>
                  <option value="copper">Copper</option>
                  <option value="stainless-steel">Stainless Steel</option>
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
                <br />
              </div>
            </div>
            <button class="btn btn-success">Search !</button>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import contentPhoto from "./content-photo.vue";
import doublePipeImg from '../assets/doublepipe.jpg'
import shellImg from '../assets/shell.png'

// showFunction() {
//   if (equipment === 'Double Pipe Heat Exchanger') {
//     document.getElementById('doublePipeEx').classList.remove('d-none'),
//     document.getElementById('shellTubeEx').classList.add('d-none')
//   } else if (equipment === 'Shell and Tube Heat Exchanger') {
//   document.getElementById('doublePipeEx').classList.add('d-none'),
//   document.getElementById('shellTubeEx').classList.remove('d-none')
// }
// }

// Vue.component('v-select', vSelect)
export default {
  name: "searchSpecs",
  data() {
    return {
      equipment: "",
      flowType: "",
      material: "",
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
      passes: ""
    };
  },
  components: {
    contentPhoto
  },
  methods: {
    show() {
      if (this.equipment === "doublepipe") {
        document.getElementById("doublePipeEx").classList.remove("d-none"),
        document.getElementById("shellTubeEx").classList.add("d-none"),
        document.getElementById("shufflingImage").src=doublePipeImg;
      } else if (this.equipment === "shellandtube") {
        document.getElementById("doublePipeEx").classList.add("d-none"),
        document.getElementById("shellTubeEx").classList.remove("d-none"),
        document.getElementById("shufflingImage").src=shellImg;
      }
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