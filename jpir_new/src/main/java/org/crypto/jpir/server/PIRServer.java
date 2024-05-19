package org.crypto.jpir.server;

import org.crypto.jpir.crypto.HE;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.PublicKey;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
public class PIRServer implements PIRServer_Intf {
    private Connection connection;
    private HE homEnc;
    private BigInteger[][] matrixDB;
    private int dbDimension;
    private String inputFile;
    private ArrayList<String> wordsInFile;

    public PIRServer(HE c, int maxWidth, String inputFile) {
        this.homEnc = c;
        this.inputFile = inputFile;
        // Initialize the database connection in the constructor
        establishDatabaseConnection();
    }

    private void establishDatabaseConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC driver not found", e);
        }

        String url = "jdbc:mysql://localhost:3306/pir?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "yaralab6";
        try {
            connection = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to establish database connection", e);
        }
    }

    private String decryptProduct(ArrayList<BigInteger> encryptedProduct) {
        // Initialize variables
        StringBuilder decryptedString = new StringBuilder();

        // Loop through each element in the query vector
        for (BigInteger encryptedValue : encryptedProduct) {
            // Decrypt the current element
            BigInteger decryptedValue = homEnc.decrypt(encryptedValue);

            // Convert the decrypted BigInteger to a string
            String stringValue = new String(decryptedValue.toByteArray());

            // Append the decrypted string value to the result
            decryptedString.append(stringValue);
        }

        return decryptedString.toString();
    }

    // Method to decrypt the product ID
    private String decryptProductId(ArrayList<BigInteger> encryptedProductId) {
        // Initialize variables
        int index = 0;
        int position = 0;
        int power = 1;
        int dbSize = 1000;
        int queryDim = 2;
        int querySize = (int)Math.round(Math.ceil(Math.pow(dbSize, 1.0 / queryDim)));

        // Loop through each element in the query vector
        for (BigInteger encryptedValue : encryptedProductId) {
            // Decrypt the current element
            BigInteger decryptedValue = homEnc.decrypt(encryptedValue);

            // Find the position of the nonzero value
            int nonzeroPosition = decryptedValue.intValue();

            // Calculate the index based on the position of the nonzero value
            index += nonzeroPosition * power;

            // Update position and power for the next iteration
            position++;
            power *= querySize;
        }

        // Convert the calculated index to a string and return
        return Integer.toString(index);
    }

    @Override
    public ArrayList<BigInteger> processQuery(ArrayList<BigInteger> queryVector) {
        ArrayList<BigInteger> responseVector = new ArrayList<>();
        try {
            if (connection == null || connection.isClosed()) {
                establishDatabaseConnection();
            }

            // Ensure the query vector has at least one element
            if (queryVector.isEmpty()) {
                throw new IllegalArgumentException("Query vector is empty");
            }
//            System.out.println("queryVector " + queryVector);

            // Decrypt the query vector to obtain the product ID
            BigInteger encryptedProductId = queryVector.get(0);
            ArrayList<BigInteger> encryptedProductIdList = new ArrayList<>();
            encryptedProductIdList.add(encryptedProductId); // Wrap the single BigInteger in an ArrayList
//            System.out.println("encryptedProductIdList: " +encryptedProductIdList);
            String decryptedProductId = decryptProductId(encryptedProductIdList); // Pass the wrapped ArrayList
//            System.out.println("decryptedProductId " + decryptedProductId);

            int productId = Integer.parseInt(decryptedProductId); // Convert String to int
//            System.out.println("Executing SQL query: SELECT name, description, price, quantity FROM products WHERE id = " + productId);

            String sql = "SELECT name, description, price, quantity FROM products WHERE id = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, productId);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                String name = resultSet.getString("name");
                String description = resultSet.getString("description");
                BigDecimal price = resultSet.getBigDecimal("price");
                int quantity = resultSet.getInt("quantity");

                // Encrypt the retrieved data
                BigInteger encryptedName = homEnc.encryptString(name);
                BigInteger encryptedDescription = homEnc.encryptString(description);
                BigInteger encryptedPrice = homEnc.encrypt(price.unscaledValue());
                BigInteger encryptedQuantity = homEnc.encrypt(BigInteger.valueOf(quantity));

                responseVector.add(encryptedName);
                responseVector.add(encryptedDescription);
                responseVector.add(encryptedPrice);
                responseVector.add(encryptedQuantity);
            }

            resultSet.close();
            statement.close();

//            System.out.println("Retrieved response: " + responseVector);

        } catch (SQLException e) {
            throw new RuntimeException("Error processing query", e);
        }
        return responseVector;
    }

    private void loadWords() throws IOException {
        FileInputStream inputStream = null;
        try {
            inputStream = new FileInputStream(inputFile);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        Scanner scanner = new Scanner(inputStream);

        wordsInFile = new ArrayList<>();
        while (scanner.hasNextLine()) {
            wordsInFile.add(scanner.nextLine());
        }
        scanner.close();
    }

    public void setMatrixDB(BigInteger[][] matrixDB) throws UnsupportedEncodingException {
        if (matrixDB == null) {
            this.matrixDB = new BigInteger[dbDimension][dbDimension];
            for (int i = 0; i < dbDimension; i++) {
                for (int j = 0; j < dbDimension; j++) {
                    String word = wordsInFile.get(i + j);
                    try {
                        this.matrixDB[i][j] = new BigInteger(word.getBytes("UTF-8"));
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        } else
            this.matrixDB = matrixDB;
    }

    @Override
    public BigInteger[][] getDB() {
        return matrixDB;
    }

    @Override
    public int getDBDimension() {
        return dbDimension;
    }

    @Override
    public PublicKey getPublicKey() {
        return null;
    }

    @Override
    public BigInteger getRealItem(int index) {
        return getRealRow(index).get(index);
    }

    /* For testing purposes */
    public ArrayList<BigInteger> getRealRow(int index) {
        ArrayList<BigInteger> realRow = new ArrayList<>(dbDimension);
        realRow.addAll(Arrays.asList(matrixDB[index]).subList(0, dbDimension));
        return realRow;
    }
}
