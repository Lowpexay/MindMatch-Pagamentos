--TIPO NECESSÁRIO PARA RODAR O TRIGGER
--CREATE OR REPLACE TYPE T_LISTA_NUMBER_TABLE AS TABLE OF NUMBER;

CREATE OR REPLACE TRIGGER TRG_UPDATE_VALOR_MEDIO_PAGAMENTO_CLIENTE
FOR INSERT OR UPDATE OR DELETE ON tb_pagamento
COMPOUND TRIGGER

    g_lista_clientes T_LISTA_NUMBER_TABLE;
    
    BEFORE STATEMENT IS
    BEGIN
        g_lista_clientes := T_LISTA_NUMBER_TABLE();
    END BEFORE STATEMENT;
    
    AFTER EACH ROW IS
    
    BEGIN
        IF INSERTING OR UPDATING THEN
            g_lista_clientes.EXTEND;
            g_lista_clientes(g_lista_clientes.LAST) := :NEW.id_cliente;
        END IF;
        
        IF DELETING OR UPDATING THEN
            IF :NEW.id_cliente IS NULL OR :OLD.id_cliente != :NEW.id_cliente THEN
                g_lista_clientes.EXTEND;
                g_lista_clientes(g_lista_clientes.LAST) := :OLD.id_cliente;
            END IF;
        END IF;
    END AFTER EACH ROW;
    
    AFTER STATEMENT IS
        
        l_clientes_unicos T_LISTA_NUMBER_TABLE;
    BEGIN
        IF g_lista_clientes IS NOT EMPTY THEN
            SELECT DISTINCT column_value
            BULK COLLECT INTO l_clientes_unicos
            FROM TABLE(g_lista_clientes);
            
            IF l_clientes_unicos IS NOT EMPTY THEN
                FORALL i IN 1..l_clientes_unicos.COUNT
                    UPDATE tb_cliente c
                    SET c.VALOR_MEDIO_PAGAMENTO = pkg_cliente.ticket_medio_cliente( l_clientes_unicos(i) )
                    WHERE c.id_cliente = l_clientes_unicos(i);
            END IF;
        END IF;
    END AFTER STATEMENT;
END TRG_UPDATE_VALOR_MEDIO_PAGAMENTO_CLIENTE;
/