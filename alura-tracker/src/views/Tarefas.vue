<template>
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" type="text" placeholder="Digite para filtrar" v-model="filtro">
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />
        <Box v-if="listaEstaVazia">
            Você não está muito produtivo hoje :c
        </Box>
        <Modal :mostrar="tarefaSelecionada != null" v-if="tarefaSelecionada">
            <template v-slot:cabecalho>
                <p class="modal-card-title">Editanto tarefa</p>
                <button class="delete" aria-label="close" @click="fecharModal"></button>
            </template>
            <template v-slot:corpo>
                <div class="field">
                    <label for="descricaoDaTarefa" class="label">
                        Descrição
                    </label>
                    <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa">
                </div>
            </template>
            <template v-slot:rodape>
                <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
                <button @click="fecharModal" class="button">Cancelar</button>
            </template>
        </Modal>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, ref, watchEffect } from "vue";
import Formulario from "../components/Formulario.vue";
import Tarefa from "../components/Tarefa.vue";
import Box from "../components/Box.vue";
import { useStore } from "@/store";
import { OBTER_TAREFAS, CADASTRAR_TAREFA, OBTER_PROJETOS, ALTERAR_TAREFA } from "@/store/tipo-acoes";
import ITarefa from "@/interfaces/ITarefa";
import useNotificador from "@/hooks/notificador";
import { TipoNotificacao } from "@/interfaces/INotificacao";
import Modal from "../components/Modal.vue";


export default defineComponent({
    name: "App",
    components: { Formulario, Tarefa, Box, Modal },
    data() {
        return {
            tarefaSelecionada: null as ITarefa | null
        }
    },
    computed: {
        listaEstaVazia(): boolean {
            return this.tarefas.length === 0;
        }
    },
    methods: {
        salvarTarefa(tarefa: ITarefa) {
            this.store.dispatch(CADASTRAR_TAREFA, tarefa)
                .then(() => {
                    this.notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'A tarefa foi cadastrada com sucesso.')
                })
                .catch(() => {
                    this.notificar(TipoNotificacao.FALHA, 'Algo deu errado!', 'Não foi possível cadastrar a tarefa, tente novamente.')
                })
        },
        selecionarTarefa(tarefa: ITarefa) {
            this.tarefaSelecionada = tarefa;
        },
        fecharModal() {
            this.tarefaSelecionada = null;
        },
        alterarTarefa() {
            this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada)
                .then(() => {
                    this.notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'A tarefa foi alterada com sucesso.');
                    this.fecharModal();
                })
                .catch(() => {
                    this.notificar(TipoNotificacao.FALHA, 'Algo deu errado!', 'Não foi possível alterar a tarefa, tente novamente.')
                })
        }
    },
    setup() {
        const store = useStore();
        store.dispatch(OBTER_TAREFAS);
        store.dispatch(OBTER_PROJETOS);
        const { notificar } = useNotificador();
        const filtro = ref("");

        // const tarefas = computed(() =>
        //     store.state.tarefas.filter(
        //         (tarefa) => !filtro.value || tarefa.descricao.toLowerCase().includes(filtro.value.toLocaleLowerCase())
        //     )
        // );

        watchEffect(() => {
            store.dispatch(OBTER_TAREFAS, filtro.value);
        });

        return {
            tarefas: computed(() => store.state.tarefas),
            store,
            notificar,
            filtro
        }
    },
});
</script>
  
<style scoped>
.lista {
    padding: 1.25rem;
}
</style>
  