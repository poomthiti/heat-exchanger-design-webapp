<template>
    <div id="myNav">
        <nav 
        class="navbar navbar-expand-lg navbar-light bg-light d-flex py-2" 
        style="border-bottom:rgb(201, 1, 44) solid 2px">
            <router-link to="/" class="navbar-brand px-5">
                <img src="../assets/chula-engineering-logo.png" 
                class="d-inline-flex align-top my-2" 
                alt=""
                width="300px"
                height="35px"
                >
            </router-link>
        </nav>
    </div>
</template>

<script>
export default {
  name: "myNav",
}
</script>