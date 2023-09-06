<script setup>

  // Props
  import {computed} from "vue";
  import IlluBaby from "@/components/icons/IlluBaby.vue";
  import IconBlob from "@/components/icons/IconBlob.vue";
  import IconBaby from "@/components/icons/IconBaby.vue";
  import {object} from "underscore";

  const props = defineProps({
      user: {
          type: Object,
          required: false,
          default: {}
      },
      isAdmin: {
          type: Boolean,
          required: false,
          default: false
      }
  })

  // Computed
  const formatedDescription = computed(() => {
      const paragraphs = props.user.description.split('\n')
      return paragraphs.map((paragraph) => {
          return paragraph.length > 1 ? `<p>${paragraph}</p>` : ''
      }).join('');
  })

</script>

<template>
    <div class="header wrapper">
        <div class="header__illustration">
            <IconBlob class="header__illustration__background"/>
            <IlluBaby class="header__illustration__img"/>
        </div>
        <div class="header__content">
            <h1>Liste de naissance <span v-if="isAdmin" class="header__content__admin">admin</span></h1>
            <div class="header__content__date">
                <IconBaby/>
                <span>{{ user.birthdayDate }}</span>
            </div>
        </div>

    </div>

    <div class="description wrapper">
        <div v-if="user.description" v-html="formatedDescription" class="description__content"></div>
        <p v-if="user.parents_name" class="description__signature">{{ user.parents_name }}</p>
    </div>

</template>

<style lang="scss">
    .header{
        display: flex;
        align-items: center;
        gap: 2rem;

        &__illustration{
            position: relative;
            flex-shrink: 0;
            margin-top: 2rem;
            transform: scale(.85);

            &__background{
                fill: var(--color-primary);
                position: absolute;
                left:-55%;
                top:-20%;
                z-index: -1;
                transform: scale(1.7);
            }
        }

        &__content{
            h1{
                line-height: 1;
                font-size: 4rem;
            }

            &__date{
                display: flex;
                align-items: center;
                gap:1rem;
                margin-top: 1rem;

                svg{
                    stroke: var(--color-primary) !important;
                    fill: var(--color-primary) !important;
                }
            }

            &__admin{
                font-size: .5em;
                background-color: var(--color-red);
                color: var(--color-white);
                padding: .3em .5em;
                border-radius: .5em;
                display: inline-flex;
            }
        }
    }

    .description{
        margin-top: 2.5rem;

        &__content{
            p + p{
                margin-top: .8em;
            }
        }

        &__signature{
            font-weight: bold;
            margin-top: 1em;
        }
    }
</style>
