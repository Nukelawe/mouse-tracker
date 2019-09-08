package org.duckdns.nukelawe;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class MouseTracker {
    public static void main(String args[]) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        System.out.println("server started at " + port);
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange he) throws IOException {
                OutputStream os = he.getResponseBody();
                String response = "";
                if (he.getRequestMethod().equals("POST")) {
                    InputStreamReader isr = new InputStreamReader(he.getRequestBody(), StandardCharsets.UTF_8);
                    BufferedReader br = new BufferedReader(isr);
                    String query = br.readLine();
                    response = "received " + query;
                    he.sendResponseHeaders(200, response.length());
                    System.out.println("POST: " + query);
                } else {
                    he.sendResponseHeaders(404, 0);
                    System.out.println("GET");
                }
                os.write(response.getBytes());
                os.close();
            }
        });
        server.setExecutor(null);
        server.start();
    }
}
