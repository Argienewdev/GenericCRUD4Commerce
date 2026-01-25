package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.SaleDTO;
import com.app.model.Sale;
import com.app.model.User;
import com.app.security.Secured;
import com.app.security.SecurityContext;
import com.app.service.SaleService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

@Path("/api/v1/sales")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Secured
public class SaleController {

  private static final Logger LOG = Logger.getLogger(SaleController.class);

  @Inject
  SaleService saleService;

  @Inject
  SecurityContext securityContext;

  @GET
  public Response list() {
    LOG.info("GET /api/v1/sales - Listando ventas");
    return Response.ok(saleService.getAllSales()).build();
  }

  @POST
  public Response create(SaleDTO saleDTO) {
    User currentUser = securityContext.getCurrentUser();
    LOG.infof("POST /api/v1/sales - Seller: %s", currentUser.getUsername());

    try {
      Sale createdSale = saleService.createSale(saleDTO, currentUser);
      return Response.status(Response.Status.CREATED)
          .entity(createdSale)
          .build();
    } catch (IllegalArgumentException | IllegalStateException e) {
      LOG.warnf("Error de validación al crear venta: %s", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
          .entity(new ApiResponse(false, e.getMessage()))
          .build();
    } catch (Exception e) {
      LOG.error("Error interno al crear venta", e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity(new ApiResponse(false, "Error interno del servidor"))
          .build();
    }
  }

  @DELETE
  @Path("/{id}")
  public Response delete(@PathParam("id") Long id) {
    // Solo elimina, no restaura stock
    LOG.infof("DELETE /api/v1/sales/%d", id);
    boolean deleted = saleService.deleteSale(id);
    if (deleted) {
      return Response.noContent().build();
    } else {
      return Response.status(Response.Status.NOT_FOUND)
          .entity(new ApiResponse(false, "Venta no encontrada"))
          .build();
    }
  }
}
