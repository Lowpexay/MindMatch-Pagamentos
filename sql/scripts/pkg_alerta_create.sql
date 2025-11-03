CREATE OR REPLACE PACKAGE PKG_ALERTA AS
    PROCEDURE LISTAR_ALERTAS(
        o_cursor OUT SYS_REFCURSOR
    );
    
    PROCEDURE REGISTRAR_ALERTAS (
        p_limite IN NUMBER,
        o_qtd    OUT NUMBER
    );
END PKG_ALERTA;
/

CREATE OR REPLACE PACKAGE BODY PKG_ALERTA AS
    PROCEDURE LISTAR_ALERTAS (
        o_cursor OUT SYS_REFCURSOR
    ) AS
    BEGIN
        PRC_LISTAR_ALERTAS (
            o_cursor => o_cursor
        );
    END LISTAR_ALERTAS;
    
    PROCEDURE REGISTRAR_ALERTAS (
        p_limite IN NUMBER,
        o_qtd    OUT NUMBER
    ) AS
    BEGIN
        PRC_REGISTRAR_ALERTAS (
            p_limite => p_limite,
            o_qtd => o_qtd
        );
    END REGISTRAR_ALERTAS;
END PKG_ALERTA;
/